/**
 * Canonical Rental Information & Policy Service for Bikes Rental Service.
 * Accurately reflects existing codebase policies, pricing models, and safety rules.
 */

export const PRIMARY_OPERATIONAL_HUBS = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Kolkata",
];

export const REGIONAL_DELIVERY_LOCATIONS = [
  "Agra", "Aligarh", "Ahmedabad", "Amritsar", "Almora", "Ayodhya", "Azamgarh", "Bahraich",
  "Ballia", "Bareilly", "Barabanki", "Basti", "Bageshwar", "Bangalore", "Bhopal", "Bhubaneswar",
  "Bulandshahr", "Chandigarh", "Chamoli", "Champawat", "Chennai", "Coimbatore", "Deoria", "Dehradun",
  "Delhi", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Goa", "Ghaziabad", "Ghazipur",
  "Gonda", "Gorakhpur", "Gurugram", "Guwahati", "Gwalior", "Haldwani", "Hamirpur", "Hapur",
  "Hardoi", "Haridwar", "Hathras", "Hyderabad", "Indore", "Jaipur", "Jaisalmer", "Jalandhar",
  "Jammu", "Jodhpur", "Kanpur", "Jhansi", "Kochi", "Kashipur", "Kausani", "Khatima",
  "Kolkata", "Kota", "Lakhimpur", "Lansdowne", "Lucknow", "Ludhiana", "Madurai", "Manali",
  "Mathura", "Mangalore", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Mumbai", "Mysore",
  "Mussoorie", "Nainital", "Nagpur", "Nashik", "Noida", "Ooty", "Patna", "Pauri",
  "Pilibhit", "Pithoragarh", "Pondicherry", "Prayagraj", "Pune", "Rae Bareli", "Ramnagar", "Rampur",
  "Ranikhet", "Ranchi", "Rishikesh", "Roorkee", "Rudraprayag", "Rudrapur", "Saharanpur", "Sambhal",
  "Shillong", "Shimla", "Shahjahanpur", "Shravasti", "Sitapur", "Siliguri", "Sonbhadra", "Srinagar",
  "Surat", "Sultanpur", "Tehri", "Thiruvananthapuram", "Udaipur", "Unnao", "Uttarkashi", "Vadodara",
  "Varanasi", "Vijayawada", "Visakhapatnam", "Warangal",
];

/**
 * Checks whether a requested location is a Primary Hub, Regional Delivery City, or Unsupported.
 */
export const checkLocationCoverage = (cityName) => {
  if (!cityName || typeof cityName !== "string") return null;
  const target = cityName.trim().toLowerCase();

  const isPrimary = PRIMARY_OPERATIONAL_HUBS.find(
    (hub) => hub.toLowerCase() === target
  );
  if (isPrimary) {
    return {
      cityName: isPrimary,
      type: "PRIMARY_OPERATIONAL_HUB",
      hasPhysicalStation: true,
      services: [
        "Instant walk-in bike pickup",
        "Full fleet maintenance & test rides",
        "Dedicated customer handover station",
        "Drop-off and return inspection",
      ],
      description: `${isPrimary} is a Primary Operational Hub with a physical walk-in station for instant bike pickup and return.`,
    };
  }

  const isRegional = REGIONAL_DELIVERY_LOCATIONS.find(
    (loc) => loc.toLowerCase() === target
  );
  if (isRegional) {
    return {
      cityName: isRegional,
      type: "REGIONAL_DELIVERY_LOCATION",
      hasPhysicalStation: false,
      services: [
        "Scheduled doorstep motorcycle delivery",
        "Scheduled doorstep return pickup",
        "Advance online booking required",
      ],
      description: `${isRegional} is covered under our ${REGIONAL_DELIVERY_LOCATIONS.length}-city Regional Doorstep Delivery network. Physical pickup stations are not present in ${isRegional}; bikes are delivered directly to your location upon advance booking.`,
    };
  }

  return {
    cityName,
    type: "UNSUPPORTED_LOCATION",
    hasPhysicalStation: false,
    services: [],
    description: `We currently do not offer direct service in "${cityName}". We operate 7 primary hubs (Delhi, Mumbai, Bangalore, Pune, Hyderabad, Chennai, Kolkata) and ${REGIONAL_DELIVERY_LOCATIONS.length} regional delivery cities across India.`,
  };
};

export const RENTAL_POLICIES = {
  pricing_and_tax: {
    title: "Rental Pricing & Tax Structure",
    details:
      "Daily rental rates vary by motorcycle category and model. On top of the base rental rate, an 18% GST (Goods & Services Tax) is applied and rounded to the nearest rupee. The total booking amount is calculated as: (Price per Day * Rental Days) + 18% GST + Refundable Security Deposit. No hidden fees or arbitrary surcharges are applied.",
  },
  deposit: {
    title: "Security Deposit Policy",
    details:
      "A refundable security deposit is required for every rental (segment-based: ₹5,000 for Commuters/Scooters, ₹7,000 for Cruisers/Adventure, and ₹9,000 for Sports/Premium bikes). The security deposit is not subject to GST and is fully refunded within 24 to 48 hours after the bike is returned on time and inspected with no damages or pending traffic penalties.",
  },
  cancellation: {
    title: "Cancellation & Refund Policy",
    details:
      "Free cancellation is allowed at any time BEFORE the scheduled pickup date. Once the scheduled pickup date has arrived or pickup has commenced, the reservation cannot be cancelled.",
  },
  documentation: {
    title: "Mandatory Rider Documentation",
    details:
      "At the time of bike pickup or doorstep delivery, the rider must present an original, valid 2-Wheeler Driving Licence along with an original government-issued identity proof (Aadhaar Card, Passport, or Voter ID). Digital copies on DigiLocker are accepted, but physical verification of licence validity is required. Rider must be at least 18 years of age.",
  },
  safety_and_helmets: {
    title: "Safety Rules & Helmets",
    details:
      "ISI-certified helmets must be worn at all times by both rider and pillion as strictly mandated by Indian traffic law. One ISI-certified helmet is provided complimentary with every rental. A secondary helmet for pillion riders is available upon request at the pickup hub.",
  },
  payment_methods: {
    title: "Accepted Payment Methods",
    details:
      "We support 'Pay at Pickup' (cash, UPI, debit/credit cards at the local hub) as well as secure online advance checkout.",
  },
  locations: {
    title: "Rental Hubs & Nationwide Delivery Coverage",
    primaryHubs: PRIMARY_OPERATIONAL_HUBS,
    totalCoverageCities: REGIONAL_DELIVERY_LOCATIONS.length,
    details:
      "Bikes Rental Service operates in two distinct tiers:\n" +
      `1. Primary Operational Hubs (Physical Stations): Walk-in vehicle collection, instant handovers, and full-fleet customer service stations exist in 7 major metropolitan hubs: Delhi, Mumbai, Bangalore, Pune, Hyderabad, Chennai, and Kolkata.\n` +
      `2. Regional Doorstep Delivery & Drop-off (${REGIONAL_DELIVERY_LOCATIONS.length} Cities): We provide scheduled doorstep delivery and pickup across ${REGIONAL_DELIVERY_LOCATIONS.length} cities across India (including Jaipur, Goa, Chandigarh, Dehradun, Rishikesh, Lucknow, Ahmedabad, Varanasi, etc.) upon advance booking.\n` +
      "IMPORTANT POLICY: Physical pickup stations exist ONLY at our 7 primary operational hubs. All other regional cities are supported via scheduled doorstep delivery and return pickup.",
  },
  fuel_policy: {
    title: "Fuel Policy",
    details:
      "Bikes are provided with sufficient fuel to comfortably reach the nearest petrol pump. Riders are requested to return the bike with approximately the same fuel level as provided at pickup.",
  },
};

/**
 * Returns accurate policy text by topic or full overview.
 */
export const getRentalInformation = (topic = "all", locationName = null) => {
  if (locationName) {
    const coverage = checkLocationCoverage(locationName);
    return {
      topic: "locations",
      locationInquiry: coverage,
      policy: RENTAL_POLICIES.locations,
    };
  }

  if (topic && topic !== "all" && RENTAL_POLICIES[topic]) {
    return {
      topic,
      ...RENTAL_POLICIES[topic],
    };
  }

  return {
    overview: "Bikes Rental Service Customer Policies and Rental Guidelines",
    policies: RENTAL_POLICIES,
  };
};

