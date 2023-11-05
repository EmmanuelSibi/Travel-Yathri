const Amadeus = require('amadeus');

const amadeus = new Amadeus({
    clientId: '8G52cFNqBtOXcXAUJA6TAWeVlKnzaoFI',
    clientSecret: 'XUotLkEjVJ5Qyf0U'
});

const cityAirportCodes = {
    Vijayawada: "VGA",
    Visakhapatnam: "VTZ",
    Itanagar: "DBU",
    Pasighat: "IXT",
    Tezu: "TEZ",
    Dibrugarh: "DIB",
    Guwahati: "GAU",
    Jorhat: "JRH",
    Silchar: "IXS",
    Darbhanga: "DBR",
    Gaya: "GAY",
    Patna: "PAT",
    Raipur: "RPR",
    Chandigarh: "IXC",
    Delhi: "DEL",
    Goa: "GOI",
    Ahmedabad: "AMD",
    Vadodara: "BDQ",
    Hisar: "HSS",
    Karnal: "IKR",
    Dharamsala: "DHM",
    "Kullu-Manali": "KUU",
    Jammu: "IXJ",
    Leh: "IXL",
    Srinagar: "SXR",
    Ranchi: "IXR",
    Bengaluru: "BLR",
    Hubli: "HBX",
    Mangaluru: "IXE",
    Mysore: "MYQ",
    Kannur: "CNN",
    Kochi: "COK",
    Thiruvananthapuram: "TRV",
    Bhopal: "BHO",
    Indore: "IDR",
    Jabalpur: "JLR",
    Aurangabad: "IXU",
    Mumbai: "BOM",
    Nagpur: "NAG",
    Pune: "PNQ",
    Imphal: "IMF",
    Shillong: "SHL",
    Aizawl: "AJL",
    Dimapur: "DMU",
    Bhubaneswar: "BBI",
    Jharsuguda: "JRG",
    Puducherry: "PUD",
    Amritsar: "ATQ",
    Ludhiana: "LUH",
    Jaipur: "JAI",
    Jodhpur: "JDH",
    Udaipur: "UDR",
    Pakyong: "PYG",
    Chennai: "MAA",
    Coimbatore: "CJB",
    Madurai: "IXM",
    Tiruchirappalli: "TRZ",
    Hyderabad: "HYD",
    Warangal: "WGL",
    Agartala: "IXA",
    Agra: "AGR",
    Allahabad: "IXD",
    Lucknow: "LKO",
    Varanasi: "VNS",
    Dehradun: "DED",
    Kolkata: "CCU",
    London: "LHR",
    Paris: "CDG",
    "New York City": "JFK",
    Tokyo: "HND",
    Amsterdam: "AMS",
    Barcelona: "BCN",
    Berlin: "BER",
    Bangkok: "BKK",
    Beijing: "PEK",
    Brisbane: "BNE",
    "Buenos Aires": "EZE",
    Cairo: "CAI",
    "Cape Town": "CPT",
    Chicago: "ORD",
    Copenhagen: "CPH",
    Dallas: "DFW",
    Dubai: "DXB",
    Dublin: "DUB",
    Frankfurt: "FRA",
    Geneva: "GVA",
    "Hong Kong": "HKG",
    Houston: "IAH",
    Istanbul: "IST",
    Jakarta: "CGK",
    Johannesburg: "JNB",
    Karachi: "KHI",
    "Kuala Lumpur": "KUL",
    Lima: "LIM",
    "Los Angeles": "LAX",
    Madrid: "MAD",
    Manchester: "MAN",
    Melbourne: "MEL",
    Miami: "MIA",
    Milan: "MXP",
    Montreal: "YUL",
    Moscow: "SVO",
    Mumbai: "BOM",
    Munich: "MUC",
    Osaka: "KIX",
    Oslo: "OSL",
    Perth: "PER",
    Philadelphia: "PHL",
    Phoenix: "PHX",
    Prague: "PRG",
    Rome: "FCO",
    "San Francisco": "SFO",
    "São Paulo": "GRU",
    Seattle: "SEA",
    Seoul: "ICN",
    Shanghai: "PVG",
    Singapore: "SIN",
    Stockholm: "ARN",
    Sydney: "SYD",
    Taipei: "TPE",
    Toronto: "YYZ",
    Vancouver: "YVR",
    Vienna: "VIE",
    "Washington, D.C.": "IAD",
    Zurich: "ZRH",
  };

async function getHotelLocations(destination) {
    try {
        const cityCode = getCityCode(destination);
        
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

function getCityCode(cityName) {
    const trimmedCityName = cityName.trim(); // Remove leading/trailing spaces
    return cityAirportCodes[trimmedCityName] || "City not found";
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


// const formattedText = Object.keys(hotelData).map((index) => {
//     const hotel = hotelData[index];
//     return `${index}. ${hotel.name}\nLocation - ${hotel.mapLink}`;
// });

// console.log(formattedText.join('\n'));