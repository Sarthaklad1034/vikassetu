// geoService.js
const { Client } = require('@googlemaps/google-maps-services-js');
const environment = require('../config/environment');

const client = new Client({});

class GeoService {
    async geocodeLocation(address) {
        try {
            const response = await client.geocode({
                params: {
                    address,
                    key: environment.services.maps.apiKey
                }
            });

            if (response.data.results.length > 0) {
                const location = response.data.results[0].geometry.location;
                return {
                    type: 'Point',
                    coordinates: [location.lng, location.lat]
                };
            }
            throw new Error('Location not found');
        } catch (error) {
            console.error('Geocoding Error:', error);
            throw new Error('Failed to geocode location');
        }
    }

    async calculateDistance(point1, point2) {
        try {
            const response = await client.distancematrix({
                params: {
                    origins: [`${point1.coordinates[1]},${point1.coordinates[0]}`],
                    destinations: [`${point2.coordinates[1]},${point2.coordinates[0]}`],
                    key: environment.services.maps.apiKey
                }
            });

            return response.data.rows[0].elements[0].distance.value;
        } catch (error) {
            console.error('Distance Calculation Error:', error);
            throw new Error('Failed to calculate distance');
        }
    }

    async findNearbyProjects(location, radius) {
        try {
            const Project = require('../models/Project');
            return await Project.find({
                location: {
                    $near: {
                        $geometry: location,
                        $maxDistance: radius
                    }
                }
            });
        } catch (error) {
            console.error('Nearby Projects Error:', error);
            throw new Error('Failed to find nearby projects');
        }
    }
}

module.exports = new GeoService();