const Amadeus = require('amadeus');

const amadeus = new Amadeus({
    clientId: '8G52cFNqBtOXcXAUJA6TAWeVlKnzaoFI',
    clientSecret: 'XUotLkEjVJ5Qyf0U'
});

async function getHotelLocations(cityCode) {
    try {
        const response = await amadeus.referenceData.locations.hotels.byCity.get({
            cityCode: cityCode,
            ratings: '5',
        });

        const hotelData = response.data;

        // Map the first 5 hotels to extract name and geo code
        const mappedData = hotelData.slice(0, 5).map((hotel) => ({
            name: hotel.name,
            geoCode: {
                latitude: hotel.geoCode.latitude,
                longitude: hotel.geoCode.longitude,
            },
        }));

        // Generate Google Maps links and add them to the mapped data
        const mappedDataWithLinks = mappedData.map((hotel) => ({
            ...hotel,
            mapLink: `http://maps.google.com/maps?q=${hotel.geoCode.latitude},${hotel.geoCode.longitude}`,
        }));

        const transformedResponse = {};
        mappedDataWithLinks.forEach((hotel, index) => {
            transformedResponse[index + 1] = hotel;
        });
        console.log(transformedResponse)

        return transformedResponse;
    } catch (error) {
        throw new Error('An error occurred');
    }
}

module.exports = { getHotelLocations };


// app.get('/hotel-locations', async (req, res) => {
//     const cityCode = 'COK'; // Replace with the desired city code
//     try {
//         const hotelLocations = await getHotelLocations(cityCode);
//         res.json(hotelLocations);
//     } catch (error) {
//         res.status(500).json({ error: 'An error occurred' });
//     }
// });
