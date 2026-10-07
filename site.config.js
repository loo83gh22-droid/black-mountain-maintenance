// =============================================
// SITE CONFIG: the single source of truth for business facts.
// Edit values here, then run `node build.js` to regenerate the pages.
// Credential lines only appear on the site when their flag is true.
// Any link left as "" is hidden, not shown broken.
// =============================================

module.exports = {
  businessName: "Black Mountain Maintenance",
  ownerName: "Rob Thompson",
  phone: "780-972-4848",
  email: "rob@blackmountainmaintenance.ca",
  siteUrl: "https://www.blackmountainmaintenance.ca",
  googleReviewUrl: "https://g.page/r/CY1GS3N-7jVCEBM/review",
  facebookReviewUrl: "https://www.facebook.com/BlackMountainMaintenance/reviews",
  googleProfileUrl: "https://g.page/r/CY1GS3N-7jVCEBQ",
  facebookUrl: "https://www.facebook.com/profile.php?id=61589719342274",

  serviceAreas: [
    "Black Mountain",
    "Kirschner Mountain",
    "Kettle Valley",
    "Rutland",
    "Glenmore",
    "Joe Rich",
  ],

  quoteReplyTime: "within one business day",

  // Shown on the Residential page. Change it with the season.
  seasonalNote: {
    title: "Fall clean-ups are booking now",
    text: "Leaves cleared, beds and perennials cut back, gutters emptied and everything hauled away. Spots fill up quickly once the leaves start dropping.",
  },

  credentials: {
    bcRegistered: true,      // Registered BC business (FM1115509), true as of Aug 2026
    insured: false,          // flip to true once liability insurance is in place
    insuranceDetails: "",    // e.g. "$2M commercial general liability"
    workSafeBC: false,       // flip once registered / clearance letter available
    businessLicence: false,  // City of Kelowna business licence
  },

  capabilityStatementPdf: "", // path to the PDF once created; the download button hides while empty

  // Contact form (Web3Forms). The access key is public by design.
  web3formsKey: "dc515cb0-6e2f-4fb7-90a9-3d7b40827418",
};
