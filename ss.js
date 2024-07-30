const { PDFDocument, PDFName } = require('pdf-lib');
const fs = require('fs');

// async function updateCheckboxOrRadio(field, value) {
//   const widgets = field.acroField.getWidgets();
//   if (Array.isArray(value)) {
//     widgets.forEach((widget, i) => {
//       const onValue = widget.getOnValue();
//       if (onValue) {
//         widget.dict.set(PDFName.of('V'), value[i] ? onValue : PDFName.of('Off'));
//         widget.dict.set(PDFName.of('AS'), value[i] ? onValue : PDFName.of('Off'));
//         console.log(`Updated checkbox/radio ${field.getName()} option ${i} to ${value[i] ? 'checked' : 'unchecked'}`);
//       }
//     });
//   } else {
//     widgets.forEach((widget) => {
//       const onValue = widget.getOnValue();
//       if (onValue) {
//         widget.dict.set(PDFName.of('V'), value ? onValue : PDFName.of('Off'));
//         widget.dict.set(PDFName.of('AS'), value ? onValue : PDFName.of('Off'));
//         console.log(`Updated checkbox/radio ${field.getName()} to ${value ? 'checked' : 'unchecked'}`);
//       }
//     });
//   }
// }

async function updateCheckboxOrRadio(field, value) {
    const widgets = field.acroField.getWidgets();
  
    // Ensure the value is a number and adjust for 0-based index
    const indexToCheck = value - 1;
  
    widgets.forEach((widget, i) => {
      const onValue = widget.getOnValue();
      if (onValue) {
        // Check the widget at the specific index, uncheck others
        const isChecked = (i === indexToCheck);
        widget.dict.set(PDFName.of('V'), isChecked ? onValue : PDFName.of('Off'));
        widget.dict.set(PDFName.of('AS'), isChecked ? onValue : PDFName.of('Off'));
        console.log(`Updated checkbox/radio ${field.getName()} option ${i} to ${isChecked ? 'checked' : 'unchecked'}`);
      }
    });
  }
  

async function populatePdfFields(inputPdfPath, outputPdfPath, data) {
  const existingPdfBytes = fs.readFileSync(inputPdfPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();

  form.getFields().forEach(field => {
    const fieldName = field.getName();
    if (data[fieldName] !== undefined) {
      const fieldValue = data[fieldName];
      if (field.constructor.name === 'PDFTextField') {
        const maxLength = field.acroField.dict.get(PDFName.of('MaxLen'));
        const textToSet = maxLength ? fieldValue.slice(0, maxLength) : fieldValue;
        field.setText(textToSet);
        console.log(`Updated text field ${fieldName} with value ${textToSet}`);
      } else if (field.constructor.name === 'PDFCheckBox' || field.constructor.name === 'PDFRadioGroup') {
        updateCheckboxOrRadio(field, fieldValue);
      }
    }
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPdfPath, pdfBytes);
  console.log(`Saved updated PDF to: ${outputPdfPath}`);
}

function mapJsonToPdfFields(jsonData) {
  const fieldMapping = {
    "property_information": {
      "MLS_Listing_Number": "txtmlsnumber",
      "Assessment_Roll_Number_ARN": "txtp_TaxID",
      "PIN_Number": "txtNum1",
      "AreaCode": "hidArea_code",
      "Municipality": "hidMunicipality_code",
      "Community": "hidCommunity_code",
      "Street_Number": "txtp_streetnum",
      "Street_Name": "txtp_street",
      "Abbrev": "hidp_uploadstreettype",
      "Dir": "chkOpt_Dir",
      "Apt_Unit_Number": "txtp_unitNumber",
      "Postal_Code": "txtp_zipcode",
      "Legal_Description": "txtp_legaldesc",
      "Property_Management": "txtpropmanagementcomp",
      "Lot_Front": "txtLotFront",
      "Lot_Depth": "txtLotDepth",
      "Lot_Bldg_Unit_Code": "chkOpt_LSize",
      "Lot_Size_Code": "chkOpt_LSizeCode",
      "Lot_Irregularities": "txtlotireegular2",

    },

    "property_information_one" : {
      "Zoning": "txtp_ZoningClass",
      "Direction_Main_Cross_Streets": "txtcrossstrts",
      "List_Price": "txtp_listprice",
      "List_Price_Code": "hidLp_code",
      "Min_Rental_Term_Months": "txtMinRentalTermM",
      "Max_Rental_Term_Months": "txtMaxRentalTermM",
      "Taxes": "txtTaxes",
      "Tax_Year": "txtTaxYear",
      "Tax_Type": "chkOpt_AmtTaxType",
      "Assessment": "txtAmtAssessment",
      "Assessment_Year": "txtAmtAssessmentYear",
      "Contract_Commencement_Month": "txtp_listdate_mm",
      "Contract_Commencement_Day": "txtp_listdate_dd",
      "Contract_Commencement_Year": "txtp_listdate_yyyy",
      "Expiry_Date_Month": "txtp_expiredate_mm",
      "Expiry_Date_Day": "txtp_expiredate_dd",
      "Expiry_Date_Year": "txtp_expiredate_yyyy",
      "Possession_Date_Day": "txtp_possessiondate_dd",
      "Possession_Date_Month": "txtp_possessiondate_mm",
      "Possession_Date_Year": "txtp_possessiondate_yyyy",
      "Possession_Remarks": "txtPossRemarks",
      "Holdover_Days": "txtHODays",
      "Seller_Name": "txtseller1",
      "Mortgage_Comments": "txtmortgagecomments",
      "Condo_Maintenance_Fees_Monthly": "txtCondoMainFeesM",
    },

    "property_information_two" : {
      "Type_Commercial_Retail_Property": "chkOpt_ComRetail",
      "Category_Commercial_Retail_Property": "chkOpt_ComRetail2",
      "Use_Commercial_Retail_Property": "chkOpt_ComRetail3",
      "Type_Sale_Of_Business": "chkOpt_SOBiz",
      "Category_Sale_Of_Business": "chkOpt_SOBiz2",
      "Use_Sale_Of_Business": "chkOpt_SOBiz3",
      "Type_Store_With_Apartment_Office": "chkOpt_StoreAPTOFF",
      "Category_Store_With_Apartment_Office": "chkOpt_StoreAPTOFF2",
      "Type_Investment": "chkOpt_Investment",
      "Category_Investment": "chkOpt_Investment2",
      "Use_Investment": "chkOpt_Investment3",
      "Type_Office": "chkOpt_Office",
      "Category_Office": "chkOpt_Office2",
      "Use_Office": "chkOpt_Office3",
      "Type_Industrial": "chkOpt_Industrial",
      "Category_Industrial": "chkOpt_IndCate",
      "Use_Industrial": "chkOpt_IndCate2",
      "Type_Farm": "chkOpt_Farm",
      "Category_Farm": "chkOpt_Farm2",
      "Use_Farm": "chkOpt_Farm3",
      "Type_Land": "chkOpt_Land",
      "Category_Land": "chkOpt_Land2",
      "Use_Land": "chkOpt_Land3",
      "Freestanding": "chkOpt_FStanding",
      "Total_Area": "txtTotalArea",
      "Total_Area_Code": "chkOpt_TotalAreaCode",
      "Percent_Building": "txtPerBuilding",
      "Office_Apt_Area": "txtOfficeAptArea",
      "Office_Apt_Area_Code": "chkOpt_OFFAreaCode",
      "Industrial_Area": "txtIndusArea",
      "Industrial_Area_Code": "chkOpt_IndAreaCode",
      "Retail_Area": "txtRetailArea",
      "Retail_Area_Code": "chkOpt_RetailAreaCode",
      "Approximate_Age": "chkOpt_ApproxAge",
      "Area_Influences": "chkOpt_AreaInfluences",
      "Area_InfluencesB": "chkOpt_AreaInfluencesB",
      "Area_InfluencesC": "chkOpt_AreaInfluencesC",
      "Area_InfluencesD": "chkOpt_AreaInfluencesD",
      "Area_InfluencesE": "chkOpt_AreaInfluencesE",
      "Area_InfluencesF": "chkOpt_AreaInfluencesF",
      "Physically_Handicapped_Equipped": "chkOpt_PhyHE",
      "Basement": "chkOpt_Bstment",
      "UFFI": "chkOpt_IntUFFI",
      "Clear_Height_Feet": "txtCHeightFeet",
      "Clear_Height_Inch": "txtCHeightInches",
      "Sprinklers":"chkOpt_Sprinklers",
      "Utilities": "chkOpt_Utilities",
      "Bay_Size_Width_Feet": "txtBaySizeWidthFT",
      "Bay_Size_Width_Inch": "txtBaySizeWidthI",
      "Bay_Size_Length_Feet": "txtBaySizeLengthFT",
      "Bay_Size_Length_Inch": "txtBaySizeLengthIN",
      "Amps": "txtAMPS",
      "Volts": "txtVolts",
      "Water": "chkOpt_Water",
      "Water_Supply_Types": "chkOpt_WatSupply",
      "Air_Conditioning": "chkOpt_AirConChk",
      "Heat_Type": "chkOpt_HeatType",
      "Washrooms": "txtwshrmstypes",
    },

    "property_information_three" : {
      "Truck_Level_Ship_Doors_Num": "txtTruckLevelNum",
      "Truck_Level_Ship_Doors_Hgt_Feet": "txtDoorHeightFT",
      "Truck_Level_Ship_Doors_Hgt_Inch": "txtDoorHeightIN",
      "Truck_Level_Ship_Doors_Wdt_Feet": "txtDoorWidthFT",
      "Truck_Level_Ship_Doors_Wdt_Inch": "txtDoorWidthIN",
      "Double_Main_Ship_Doors_Num": "txtDoubleManSD",
      "Double_Main_Ship_Doors_Hgt_Feet": "txtDDDoorHeightFT",
      "Double_Main_Ship_Doors_Hgt_Inch": "txtDDDoorHeightIN",
      "Double_Main_Ship_Doors_Wdt_Feet": "txtDDMoorWidthFT",
      "Double_Main_Ship_Doors_Wdt_Inch": "txtDDMoorWidthIN",
      "Drive_Level_Ship_Doors_Num": "txtDInLevelNum",
      "Drive_Level_Ship_Doors_Hgt_Feet": "txtDIDoorHeightFT",
      "Drive_Level_Ship_Doors_Hgt_Inch": "txtDIDoorHeightIN",
      "Drive_Level_Ship_Doors_Wdt_Feet": "txtDWDoorWidthFT",
      "Drive_Level_Ship_Doors_Wdt_Inch": "txtDWDoorWidthIN",
      "Grade_Level_Ship_Doors_Num": "txtGradeLevelNum",
      "Grade_Level_Ship_Doors_Hgt_Feet": "txtGLDoorHeightFT",
      "Grade_Level_Ship_Doors_Hgt_Inch": "txtGLDoorHeightIN",
      "Grade_Level_Ship_Doors_Wdt_Feet": "txtGLDoorWidthFT",
      "Grade_Level_Ship_Doors_Wdt_Inch": "txtGLDoorWidthIN",
      "Elevator": "chkOpt_Elevator",
      "Garage_Type": "chkOpt_ExtGarType",
      "Parking_Spaces_Total": "txtParkSpacesTotal",
      "Num_Trailer_Parking_Spots": "txtNumParkSpots",
      "Outside_Storage": "chkOpt_OSStorage",
      "Rail": "chkOpt_Rail",
      "Crane": "chkOpt_Crane",
      "Survey": "chkOpt_Survey",
      "Soil_Test": "chkOpt_SoilTest",
      "Sewers": "chkOpt_SewersChq",
      "Remarks_for_Clients": "txtAd_text",
      "Extras": "txtExtras",
      "Remarks_Property_Includes": "txtp_propincludes",
      "Remarks_Property_Excludes": "txtp_propexcludes",
      "Rental_Items": "txtp_LeasedItems",
      "Remarks_for_Brokerages": "txtRemarks"
    },

    "financial_information": {
      "Financial_Statement": "chkOpt_FinStatement",
      "Chattels": "chkOpt_Chattels",
      "Franchise": "chkOpt_Franchise",
      "Days_Open": "chkOpt_DaysOpen",
      "Hours_Open": "txtHoursOpen",
      "Employees": "txtEmployees",
      "Seats": "txtSeatsNum",
      "LLBO": "chkOpt_LLBO",
      "Business_Building_Name": "txtBusinessName",
      "Taxes_Expense": "txtTaxesExpense",
      "Insurance_Expense": "txtInsuranceExp",
      "Management_Expense": "txtManagementExpense",
      "Maintenance": "txtMaintenance",
      "Heat_Expense": "txtHeatExpense",
      "Hydro_Expense": "txtHydroExpense",
      "Water_Expense": "txtWaterExp",
      "Other_Expense": "txtOtherExpense",
      "Gross_Income_Sales": "txtGrossIncome",
      "Vacancy_Allowance": "txtVanacyAllowance",
      "Operating_Expense": "txtOperatingExpense",
      "Net_Income_Before_Debt": "txtNetIncomeBDebt",
      "Est_Inv_Values_at_Cost": "txtESTValuesCost",
      "Common_Area_Upcharge": "txtComAreaUpcharge",
      "Percentage_Rent_Expenses": "txtPerRent",
      "Expenses_Year": "txtYearExpenses",
      "Expenses":"chkOpt_Expenses"
    },
  
    "brokerage_information": {
      "Listing_Brokerage": "txtNoMapListBrok",
      "LB_Phone": "txtlbroker1",
      "LB_Phone1": "txtlbroker2",
      "LB_Phone2": "txtlbroker3",
      "LB_Fax": "txtlbrokerfax1",
      "LB_Fax1": "txtlbrokerfax2",
      "LB_Fax2": "txtlbrokerfax3",
      "Broker_1_Salesperson_1": "txtNoMapListAgt",
      "Broker_1_Salesperson_1_Phone": "txtlbrkagent1",
      "Broker_1_Salesperson_1_Phone2": "txtlbrkagent2",
      "Broker_1_Salesperson_1_Phone3": "txtlbrkagent3",
      "Broker_2_Salesperson_2": "txtNoMapListAgt2",
      "Broker_2_Salesperson_2_Phone": "txtl2brkagent1",
      "Broker_2_Salesperson_2_Phone1": "txtl2brkagent2",
      "Broker_2_Salesperson_2_Phone2": "txtl2brkagent3",
      "Commission_to_Co_Operating_Brokerage": "txtp_bal2ndMortgage",
      "SPIS": "chkOpt_SPIS",
      "Energy_Certification": "chkOpt_EnergyCert",
      "Green_Property_Information": "chkOpt_GIS",
      "Certification_Level": "txtcertleveltwo",
      "Distribute_To_Internet": "chkOpt_DistrInt",
      "Display_Address_Internet": "chkOpt_DisplayInt",
      "Distribute_To_DDF": "chkOpt_DistributeDDF",
      "Permission_To_Contact": "chkOpt_PerLB",
      "Appointments": "txtAppts",
      "Occupancy": "chkOpt_Occupancy",
      "Contact_After_Expired": "chkOpt_ContExpired",
      "Virtual_Tour_URL": "txtvirtualtourURL",
      "Photo_Options": "chkOpt_PhoneOpt"
    }
  };

  return fieldMapping;
}

async function main(inputPdfPath, outputPdfPath, jsonData) {
  const fieldMapping = mapJsonToPdfFields(jsonData);
  
  const flattenedData = {};
  for (const section in jsonData) {
    for (const field in jsonData[section]) {
      const pdfFieldName = fieldMapping[section][field];
      if (pdfFieldName) {
        flattenedData[pdfFieldName] = jsonData[section][field];
      }
    }
  }

  await populatePdfFields(inputPdfPath, outputPdfPath, flattenedData);
}

const inputPdfPath = "new_unlocked.pdf";
const outputPdfPath = "output.pdf";

fs.readFile('property_data.json', 'utf8', (err, data) => {
  if (err) throw err;
  const jsonData = JSON.parse(data);
  main(inputPdfPath, outputPdfPath, jsonData);
});


// const { PDFDocument, PDFName } = require('pdf-lib');
// const fs = require('fs');

// // Function to update the radio button values
// async function updateRadioButtonValue(pdfPath, outputPath, fieldName, value) {
//   // Load the PDF document
//   const existingPdfBytes = fs.readFileSync(pdfPath);
//   const pdfDoc = await PDFDocument.load(existingPdfBytes);

//   // Get the form fields
//   const form = pdfDoc.getForm();
//   const fields = form.getFields();

//   // Find the field to update
//   const field = fields.find(f => f.getName() === fieldName);

//   if (field && field.constructor.name === 'PDFCheckBox') {
//     const widgets = field.acroField.getWidgets();
//     widgets.forEach((widget, index) => {
//       const onValue = widget.getOnValue();
//       if (onValue === PDFName.of(String(value))) {
//         widget.setAppearanceState(onValue);
//         console.log(`Set radio button ${fieldName} option ${index + 1} to checked`);
//       } else {
//         widget.setAppearanceState(PDFName.of('Off'));
//         console.log(`Set radio button ${fieldName} option ${index + 1} to unchecked`);
//       }
      
//       // Set appearance stream
//       const appearanceDict = widget.getAppearances()?.normal;
//       if (appearanceDict) {
//         const key = onValue === PDFName.of(String(value)) ? onValue : PDFName.of('Off');
//         const appearanceStream = appearanceDict.get(key);
//         if (appearanceStream) {
//           widget.setAppearanceState(key);
//         }
//       }
//     });
//   } else {
//     console.error(`Field ${fieldName} not found or not a radio button`);
//   }

//   // Save the updated PDF
//   const pdfBytes = await pdfDoc.save();
//   fs.writeFileSync(outputPath, pdfBytes);
//   console.log(`Saved updated PDF to: ${outputPath}`);
// }

// // PDF file path
// const pdfPath = 'new_unlocked.pdf';
// const outputPath = 'updated_output.pdf';

// // Example: Update the 'chkOpt_Dir' field to select the second option (OnValue: /2)
// updateRadioButtonValue(pdfPath, outputPath, 'chkOpt_Dir', 2);
