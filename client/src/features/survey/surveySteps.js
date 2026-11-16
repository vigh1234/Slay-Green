// Config-driven steps for the generic SurveyStepPage, covering the four
// "middle" survey screens (HouseholdInfo, HouseholdDetails, UserPersonalInfo,
// UserShoppingInfo) plus the final UserSpending step (rendered by
// SurveySubmitStep, which also performs the save-survey-data submit).
// UserDetailsStep (the first screen: email/country/state/etc) is its own
// dedicated component since it mixes text, country and state pickers.

export const surveySteps = [
  {
    path: "household-info",
    title: "Household Info",
    fields: [
      {
        key: "houseHoldIncomeValue",
        label: "Household income",
        type: "select",
        options: ["0", "<10,000", "10,000", "20,000", "30,000", "40,000", "50,000", "60,000", "80,000", "1,00,000", "1,20,000", "1,30,000", "1,40,000", "1,50,000", ">150000"],
      },
      { key: "numberOfVehicleValue", label: "Number of vehicles", type: "select", options: ["0", "1", "2", "3+"] },
      { key: "averageDistanceValue", label: "Average distance travelled" },
      { key: "totalDistanceValue", label: "Total distance travelled" },
    ],
    next: "household-details",
  },
  {
    path: "household-details",
    title: "Household Details",
    fields: [
      { key: "electricityBillValue", label: "Electricity bill" },
      {
        key: "cleanEnergyBillValue",
        label: "% from clean energy",
        type: "select",
        options: ["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"],
      },
      { key: "gasBillValue", label: "Gas bill" },
      { key: "heatingOilBillValue", label: "Heating oil bill" },
      { key: "areaValue", label: "Home area (sq. ft)" },
      { key: "waterBillValue", label: "Water bill" },
    ],
    next: "personal-diet",
  },
  {
    path: "personal-diet",
    title: "Personal Info",
    fields: ["meatCaloriesValue", "grainsCaloriesValue", "dairyCaloriesValue", "fruitsCaloriesValue", "snacksCaloriesValue"]
      .map((key, i) => ({
        key,
        label: ["Meat", "Grains", "Dairy", "Fruits & vegetables", "Snacks"][i] + " calories (vs. average)",
        type: "select",
        options: ["0", "Average", "2 x Average", "3 x Average", "4 x Average", "5 x Average"],
      }))
      .concat([{ key: "appliancesSpendingValue", label: "Appliances spending" }]),
    next: "shopping-info",
  },
  {
    path: "shopping-info",
    title: "Shopping Info",
    fields: ["clothSpendingValue", "entertainmentSpendingValue", "readingSpendingValue", "cleaningSpendingValue", "autoSpendingValue", "medicalSpendingValue"].map(
      (key, i) => ({ key, label: ["Clothing", "Entertainment", "Reading", "Cleaning", "Auto", "Medical"][i] + " spending" })
    ),
    next: "spending",
  },
  {
    path: "spending",
    title: "Other Spending",
    fields: ["healthSpendingValue", "communicationSpendingValue", "businessSpendingValue", "maintenanceSpendingValue", "charitySpendingValue", "otherSpendingValue"].map(
      (key, i) => ({ key, label: ["Health", "Communication", "Business", "Maintenance", "Charity", "Other"][i] + " spending" })
    ),
    next: null, // final step, submitted by SurveySubmitStep
  },
];

export default surveySteps;
