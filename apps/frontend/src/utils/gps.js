/* eslint-disable no-extend-native */
import * as geometry from 'spherical-geometry-js'

if (typeof Number.prototype.toRad === 'undefined') {
  Number.prototype.toRad = function () {
    return (this * Math.PI) / 180
  }
}

if (typeof Number.prototype.toDeg === 'undefined') {
  Number.prototype.toDeg = function () {
    return (this * 180) / Math.PI
  }
}

export function moveAlongPath(points, distance, index) {
  index = index || 0 // Set index to 0 by default.
  if (index < points.length) {
    // There is still at least one point further from this point.

    // Construct a GPolyline to use its getLength() method.

    //var polyline = new Polyline([points[index], points[index + 1]]);

    // Get the distance from this point to the next point in the polyline.
    var distanceToNextPoint = geometry.computeLength([points[index], points[index + 1]], 6371000)
    if (distance <= distanceToNextPoint) {
      // distanceToNextPoint is within this point and the next.
      // Return the destination point with moveTowards().
      return moveTowards(points[index], points[index + 1], distance)
    } else {
      // The destination is further from the next point. Subtract
      // distanceToNextPoint from distance and continue recursively.
      return moveAlongPath(points, distance - distanceToNextPoint, index + 1)
    }
  } else {
    // There are no further points. The distance exceeds the length
    // of the full path. Return null.
    return null
  }
}

export const moveTowards = function (pointStart, pointEnd, distance) {

  var lat1 = pointStart.lat.toRad()
  var lon1 = pointStart.lng.toRad()
  var lat2 = pointEnd.lat.toRad()
  var lon2 = pointEnd.lng.toRad()
  var dLon = (pointEnd.lng - pointStart.lng).toRad()

  // Find the bearing from this point to the next.
  var brng = Math.atan2(
    Math.sin(dLon) * Math.cos(lat2),
    Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon),
  )

  var angDist = distance / 6371000 // Earth's radius.

  // Calculate the destination point, given the source and bearing.
  lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angDist) + Math.cos(lat1) * Math.sin(angDist) * Math.cos(brng),
  )

  lon2 =
    lon1 +
    Math.atan2(
      Math.sin(brng) * Math.sin(angDist) * Math.cos(lat1),
      Math.cos(angDist) - Math.sin(lat1) * Math.sin(lat2),
    )

  if (isNaN(lat2) || isNaN(lon2)) return null
  return [lat2.toDeg(), lon2.toDeg()]
}

export const generatePointsToPath = (path, distanceInMeters) => {
  var nextMarkerAt = 0 // Counter for the marker checkpoints.
  var nextPoint = null // The point where to place the next marker.
  let points = []
  while (true) {
    // Call moveAlongPath which will return the GLatLng with the next
    // marker on the path.
    nextPoint = moveAlongPath(path, nextMarkerAt)
    points.push(nextPoint)
    if (nextPoint) {
      // Draw the marker on the map.

      // Add +1000 meters for the next checkpoint.
      nextMarkerAt += distanceInMeters || 1000
    } else {
      // moveAlongPath returned null, so there are no more check points.
      break
    }
  }
}
