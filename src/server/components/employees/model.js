const Sequelize = require("sequelize");
const setupDatabase = require("../../db/lib/postgresql");
module.exports = function (config) {
  const sequelize = setupDatabase(config);
  const Model = sequelize.define(
    "employees",
    {
      documenttype: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Document Type",
      },
      documentnumber: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Document Number",
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Full Name",
      },
      contracttype: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Contract Type",
      },
      position: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Position",
      },
      workday: {
        type: Sequelize.FLOAT,
        allowNull: false,
        comment: "Workday",
      },
      maritalstatus: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Marital Status",
      },
      educationlevel: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Education Level",
      },
      bloodtype: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Blood Type",
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Phone",
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Address",
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Email",
      },
      contributortype: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Contributor Type",
      },
      contributorsubtype: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Contributor Subtype",
      },
      eps: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "EPS",
      },
      arl: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "ARL",
      },
      arlrisklevel: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "ARL Risk Level",
      },
      arlriskpercentage: {
        type: Sequelize.FLOAT,
        allowNull: false,
        comment: "ARL Risk Percentage",
      },
      pension: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Pension",
      },
      compensationfund: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Compensation Fund (CCF)",
      },
      severancefund: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Severance Fund",
      },
      sex: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Sex",
      },
      birthdate: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: "Birthdate",
      },
      contractstartdate: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: "Contract Start Date",
      },
      payrolltype: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Payroll Type",
      },
      costcenter: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Cost Center",
      },
      basicmonthlysalary: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Basic Monthly Salary",
      },
      hourlyrate: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Hourly Rate",
      },
      transportationassistance: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Transportation Assistance",
      },
      mobilityassistance: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Mobility Assistance",
      },
      accounttype: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Account Type",
      },
      bank: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Bank",
      },
      accountnumber: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Account Number",
      },
      paymentmethod: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Payment Method",
      },
      workcity: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Work City",
      },
      hasadditionaldiscount: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        comment: "Has Additional Discount",
      },
      discountvalue: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Discount Value",
      },
      additionaldiscountcomment: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Additional Discount Comment",
      },
      shirtsize: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Shirt Size",
      },
      pantssize: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Pants Size",
      },
      shoesize: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Shoe Size",
      },
      companyid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "companies",
          key: "id",
        },
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: "Active",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Creation Date",
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Update Date",
      },
    },
    { tableName: "employees", timestamps: true }
  );
  return Model;
};
