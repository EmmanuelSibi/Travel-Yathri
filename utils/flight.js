const Amadeus = require('amadeus');

const amadeus = new Amadeus({
    clientId: '8G52cFNqBtOXcXAUJA6TAWeVlKnzaoFI',
    clientSecret: 'XUotLkEjVJ5Qyf0U'
});

const cityAirportCodes = {
    "Vijayawada": "VGA",
    "Visakhapatnam": "VTZ",
    "Itanagar": "DBU",
    "Pasighat": "IXT",
    "Tezu": "TEZ",
    "Dibrugarh": "DIB",
    "Guwahati": "GAU",
    "Jorhat": "JRH",
    "Silchar": "IXS",
    "Darbhanga": "DBR",
    "Gaya": "GAY",
    "Patna": "PAT",
    "Raipur": "RPR",
    "Chandigarh": "IXC",
    "Delhi": "DEL",
    "Goa": "GOI",
    "Ahmedabad": "AMD",
    "Vadodara": "BDQ",
    "Hisar": "HSS",
    "Karnal": "IKR",
    "Dharamsala": "DHM",
    "Kullu-Manali": "KUU",
    "Jammu": "IXJ",
    "Leh": "IXL",
    "Srinagar": "SXR",
    "Ranchi": "IXR",
    "Bengaluru": "BLR",
    "Hubli": "HBX",
    "Mangaluru": "IXE",
    "Mysore": "MYQ",
    "Kannur": "CNN",
    "Kochi": "COK",
    "Thiruvananthapuram": "TRV",
    "Bhopal": "BHO",
    "Indore": "IDR",
    "Jabalpur": "JLR",
    "Aurangabad": "IXU",
    "Mumbai": "BOM",
    "Nagpur": "NAG",
    "Pune": "PNQ",
    "Imphal": "IMF",
    "Shillong": "SHL",
    "Aizawl": "AJL",
    "Dimapur": "DMU",
    "Bhubaneswar": "BBI",
    "Jharsuguda": "JRG",
    "Puducherry": "PUD",
    "Amritsar": "ATQ",
    "Ludhiana": "LUH",
    "Jaipur": "JAI",
    "Jodhpur": "JDH",
    "Udaipur": "UDR",
    "Pakyong": "PYG",
    "Chennai": "MAA",
    "Coimbatore": "CJB",
    "Madurai": "IXM",
    "Tiruchirappalli": "TRZ",
    "Hyderabad": "HYD",
    "Warangal": "WGL",
    "Agartala": "IXA",
    "Agra": "AGR",
    "Allahabad": "IXD",
    "Lucknow": "LKO",
    "Varanasi": "VNS",
    "Dehradun": "DED",
    "Kolkata": "CCU",
    "London": "LHR",
    "Paris": "CDG",
    "New York City": "JFK",
    "Tokyo": "HND",
    "Amsterdam": "AMS",
    "Barcelona": "BCN",
    "Berlin": "BER",
    "Bangkok": "BKK",
    "Beijing": "PEK",
    "Brisbane": "BNE",
    "Buenos Aires": "EZE",
    "Cairo": "CAI",
    "Cape Town": "CPT",
    "Chicago": "ORD",
    "Copenhagen": "CPH",
    "Dallas": "DFW",
    "Dubai": "DXB",
    "Dublin": "DUB",
    "Frankfurt": "FRA",
    "Geneva": "GVA",
    "Hong Kong": "HKG",
    "Houston": "IAH",
    "Istanbul": "IST",
    "Jakarta": "CGK",
    "Johannesburg": "JNB",
    "Karachi": "KHI",
    "Kuala Lumpur": "KUL",
    "Lima": "LIM",
    "Los Angeles": "LAX",
    "Madrid": "MAD",
    "Manchester": "MAN",
    "Melbourne": "MEL",
    "Miami": "MIA",
    "Milan": "MXP",
    "Montreal": "YUL",
    "Moscow": "SVO",
    "Mumbai": "BOM",
    "Munich": "MUC",
    "Osaka": "KIX",
    "Oslo": "OSL",
    "Perth": "PER",
    "Philadelphia": "PHL",
    "Phoenix": "PHX",
    "Prague": "PRG",
    "Rome": "FCO",
    "San Francisco": "SFO",
    "São Paulo": "GRU",
    "Seattle": "SEA",
    "Seoul": "ICN",
    "Shanghai": "PVG",
    "Singapore": "SIN",
    "Stockholm": "ARN",
    "Sydney": "SYD",
    "Taipei": "TPE",
    "Toronto": "YYZ",
    "Vancouver": "YVR",
    "Vienna": "VIE",
    "Washington, D.C.": "IAD",
    "Zurich": "ZRH"
};

// const paragraphs = response.map((flight) => {
//     return Flight Name: ${ flight.airline } \nAmount: ${ flight.price } ${ flight.currency } \nDeparture: ${ flight.departure } \nArrival: ${ flight.arrival } \nDeparture Time: ${ flight.deptime } \nArrival Time: ${ flight.arrivalTime } \n;
// });

// // Join the paragraphs into a single string
// const formattedText = paragraphs.join('\n');
// console.log(formattedText)

async function getFlightOffers(city1, city2) {
    const originLocationCode = getAirportCode(city1);
    const destinationLocationCode = getAirportCode(city2);

    if (originLocationCode === "City not found" || destinationLocationCode === "City not found") {
        return { error: "City not found" };
    }

    const params = {
        originLocationCode,
        destinationLocationCode,
        departureDate: '2023-11-11',
        adults: 1,
        nonStop: true
    };

    try {
        const flightData = await amadeus.shopping.flightOffersSearch.get(params);

        if (flightData.result.data) {
            // Sort flight offers by price
            const sortedFlights = flightData.result.data.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));

            // Get the top 5 cheapest flight offers
            const top5CheapestFlights = sortedFlights.slice(0, 5);

            // Prepare the response in JSON format
            const response = top5CheapestFlights.map((flight, index) => ({
                flightNumber: flight.itineraries[0].segments[0].number,
                airline: flightData.result.dictionaries.carriers[flight.validatingAirlineCodes[0]],
                price: parseFloat(flight.price.total).toFixed(2),
                currency: flight.price.currency,
                departure: flight.itineraries[0].segments[0].departure.iataCode,
                arrival: flight.itineraries[0].segments[0].arrival.iataCode,
                deptime: flight.itineraries[0].segments[0].departure.at.slice(11),
                arrivalTime: flight.itineraries[0].segments[0].arrival.at.slice(11)
            }));

            response.forEach((obj, index) => {
                obj.count = (index + 1).toString();
            });

            return response;
        } else {
            return { error: 'No flight data received' };
        }
    } catch (error) {
        console.error('Error:', error);
        return { error: 'An error occurred' };
    }
}

function getAirportCode(cityName) {
    const trimmedCityName = cityName.trim(); // Remove leading/trailing spaces
    return cityAirportCodes[trimmedCityName] || "City not found";
}

module.exports = { getFlightOffers };
