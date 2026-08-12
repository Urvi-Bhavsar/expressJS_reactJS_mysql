const {
  createEmployee,
  getAllEmployees,
  updateEmployeeById,
  deleteEmployeeById,
  createTableIfNotExists,
  downloadEmployeeDetails,
  uploadEmployeeDetails,
  getTotalEmployeesCount,
} = require("../models/employeeModel");
const { sendEmail } = require("../config/mailer");
require("dotenv").config();
const ExcelJS = require("exceljs");

const createEmployeeHandler = async (req, res) => {
  const { name, age, position, email, officeDays } = req.body;

  createTableIfNotExists((err) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Failed to ensure table exists", err });
    }
  });

  createEmployee(
    name,
    age,
    position,
    email,
    officeDays,
    async (err, result) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "Failed to create employee", err });
      }

      // Send email notification (non-blocking)
      sendEmail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome to the Team!",
        cc: "bhavsarurvi143@gmail.com",
        bcc: "bhavsarurvi143@gmail.com",
        html: `
          <h1>Welcome ${name}!</h1>
          <p>You have been successfully added to our employee management system.</p>
          <p><strong>Position:</strong> ${position}</p>
          <p><strong>Office Days:</strong> ${officeDays}</p>
          <p>We're excited to have you on board!</p>
        `,
      }).catch((emailError) => {
        // Email error won't crash the server
        console.error("Email notification failed:", emailError);
      });

      res.send({
        data: { name, age, position, email, officeDays },
        message: "Employee added successfully",
      });
    }
  );
};

const getAllEmployeesHandler = (req, res) => {
  createTableIfNotExists((err) => {
    if (err) {
      return res.status(500).send({
        message: "Failed to ensure table exists",
        err,
      });
    }
    const {
      page = 1,
      pageSize = 5,
      sortField = "",
      sortOrder = "",
      search = "",
    } = req.query;
    
    // Ensure page is at least 1
    const currentPage = Math.max(1, parseInt(page, 10));
    const limit = parseInt(pageSize, 10);
    const offset = Math.max(0, (currentPage - 1) * limit);

    getTotalEmployeesCount(search, (err, totalEntries) => {
      if (err) {
        return res.status(500).send({
          message: "Failed to fetch total employee count",
          err,
        });
      }

      // If no entries, return empty array with page 1
      if (totalEntries === 0) {
        return res.send({
          data: [],
          currentPage: 1,
          pageSize: limit,
          next: null,
          totalEntries: 0,
          message: "No employee records found",
        });
      }

      // Calculate max page
      const maxPage = Math.ceil(totalEntries / limit);
      const validPage = Math.min(currentPage, maxPage);
      const validOffset = Math.max(0, (validPage - 1) * limit);

      getAllEmployees(
        validOffset,
        limit,
        sortOrder,
        sortField,
        search,
        (err, employees) => {
          if (err) {
            return res.status(500).send({
              message: "Failed to fetch employees",
              err,
            });
          }

          const next =
            validPage * limit < totalEntries ? validPage + 1 : null;

          res.send({
            data: employees,
            currentPage: validPage,
            pageSize: limit,
            next,
            totalEntries,
            message: "Employee details fetched successfully",
          });
        }
      );
    });
  });
};

const updateEmployeeHandler = (req, res) => {
  const { id } = req.params;
  const { name, age, position, email, officeDays } = req.body;

  updateEmployeeById(
    id,
    name,
    age,
    position,
    email,
    officeDays,
    (err, result) => {
      console.log("resulltttt", result);

      if (err) {
        return res
          .status(500)
          .send({ message: "Failed to update employee", err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: "Employee not found" });
      }
      res.send({
        data: { id, name, age, position, email, officeDays },
        message: "Employee updated successfully",
      });
    }
  );
};

const deleteEmployeeHandler = (req, res) => {
  const { id } = req.params;

  deleteEmployeeById(id, (err, result) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Failed to delete employee", err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Employee not found" });
    }
    res.send({ message: "Employee deleted successfully" });
  });
};

const downloadEmployeeDataHandler = (req, res) => {
  try {
    downloadEmployeeDetails((err, employees) => {
      if (err) {
        return res.status(500).json({ 
          success: false,
          error: "Database query failed",
          message: "Failed to fetch employee data from database"
        });
      }

      if (!employees.length) {
        return res.status(404).json({ 
          success: false,
          error: "No employee data found",
          message: "No employees to download. Please add employees first."
        });
      }

      // Create a new Excel workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Employees");

      // Define the columns with headers
      worksheet.columns = [
        { header: "ID", key: "employeeId", width: 10 },
        { header: "Name", key: "name", width: 20 },
        { header: "Age", key: "age", width: 10 },
        { header: "Position", key: "position", width: 20 },
        { header: "Email", key: "email", width: 30 },
        { header: "Office Days", key: "officeDays", width: 30 },
        { header: "Salary", key: "salary", width: 30 },
      ];

      // Apply styling to headers (Green background, white text, bold)
      worksheet.getRow(1).eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "00A050" }, // Green
        };
        cell.font = { bold: true, italic: true, color: { argb: "FFFFFF" } }; // White text
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      // Add employee data and apply some styling for the data rows
      employees.forEach((employee) => {
        const row = worksheet.addRow(employee);
        row.eachCell((cell) => {
          cell.alignment = { horizontal: "center", vertical: "middle" }; // Center align cells
        });
        const emailCell = row.getCell("email");
        const ageCell = row.getCell("age");
        emailCell.font = { italic: true };
        emailCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFF00" }, // Yellow
        };
        if (employee.age > 50) {
          ageCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFA500" }, // Orange
          };
        } else if (employee.age >= 20 && employee.age <= 40) {
          ageCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFF00" }, // Yellow
          };
        }
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "EmployeeDetails.xlsx"
      );

      workbook.xlsx.write(res).then(() => res.end());
    });
  } catch (error) {
    console.error("Error downloading employee data:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred while downloading employee data"
    });
  }
};

const downloadSampleFileHandler = (req, res) => {
  try {
    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employee Template");

    // Define the columns with headers
    worksheet.columns = [
      { header: "Name", key: "name", width: 20 },
      { header: "Age", key: "age", width: 10 },
      { header: "Position", key: "position", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Office Days", key: "officeDays", width: 15 },
      { header: "Salary", key: "salary", width: 15 },
    ];

    // Apply styling to headers (Blue background, white text, bold)
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "0070C0" }, // Blue
      };
      cell.font = { bold: true, color: { argb: "FFFFFF" } }; // White text
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Add sample data rows
    const sampleData = [
      {
        name: "John Doe",
        age: 30,
        position: "Developer",
        email: "john.doe@example.com",
        officeDays: 22,
        salary: 17600,
      },
      {
        name: "Jane Smith",
        age: 28,
        position: "Designer",
        email: "jane.smith@example.com",
        officeDays: 20,
        salary: 16000,
      },
      {
        name: "Bob Wilson",
        age: 35,
        position: "Manager",
        email: "bob.wilson@example.com",
        officeDays: 24,
        salary: 19200,
      },
    ];

    sampleData.forEach((employee) => {
      const row = worksheet.addRow(employee);
      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
      // Highlight sample rows with light yellow
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFCC" }, // Light yellow
        };
      });
    });

    // Add instructions sheet
    const instructionsSheet = workbook.addWorksheet("Instructions");
    instructionsSheet.columns = [
      { header: "Instructions for Using This Template", key: "instructions", width: 80 },
    ];

    const instructions = [
      "",
      "HOW TO USE THIS TEMPLATE:",
      "",
      "1. Go to the 'Employee Template' sheet",
      "2. Delete the sample data rows (rows 2-4) or replace them with your data",
      "3. Fill in employee information in the following format:",
      "",
      "   • Name: Employee full name (max 10 characters)",
      "   • Age: Employee age (18-999, whole number)",
      "   • Position: Job title (max 16 characters)",
      "   • Email: Valid email address (must end with .com, .io, or .in)",
      "   • Office Days: Number of working days per month (1-31)",
      "   • Salary: (Optional) Will be auto-calculated as Office Days × 800 if left empty",
      "",
      "4. Save the file",
      "5. Upload it using the 'Import Employee Details' button",
      "",
      "IMPORTANT NOTES:",
      "",
      "• Do NOT modify the header row (row 1)",
      "• All fields except Salary are required",
      "• Email must be unique for each employee",
      "• Age must be at least 18",
      "• Office Days cannot exceed 31",
      "• Name cannot exceed 10 characters",
      "• Position cannot exceed 16 characters",
      "",
      "EXAMPLE FORMAT:",
      "",
      "Name       | Age | Position   | Email                  | Office Days | Salary",
      "-----------|-----|------------|------------------------|-------------|--------",
      "John Doe   | 30  | Developer  | john.doe@example.com   | 22          | 17600",
      "Jane Smith | 28  | Designer   | jane.smith@example.io  | 20          | 16000",
      "",
      "If you encounter any errors during upload, check that:",
      "• All required columns are present",
      "• Data follows the validation rules above",
      "• Email addresses are unique",
      "• File is saved as .xlsx format",
    ];

    instructionsSheet.getCell("A1").font = { bold: true, size: 14, color: { argb: "0070C0" } };
    instructionsSheet.getCell("A1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "E7F3FF" },
    };

    instructions.forEach((instruction, index) => {
      const cell = instructionsSheet.getCell(`A${index + 1}`);
      cell.value = instruction;
      
      if (instruction.startsWith("HOW TO USE") || instruction.startsWith("IMPORTANT") || instruction.startsWith("EXAMPLE")) {
        cell.font = { bold: true, size: 12 };
      } else if (instruction.match(/^\d+\./)) {
        cell.font = { bold: true };
      }
      
      cell.alignment = { vertical: "middle", wrapText: true };
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Employee_Upload_Template.xlsx"
    );

    workbook.xlsx.write(res).then(() => res.end());
  } catch (error) {
    console.error("Error generating sample file:", error);
    res.status(500).json({ error: "Failed to generate sample file" });
  }
};

const handleUploadEmployeeDetails = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    //Creates a new workbook instance using the ExcelJS library.
    const workbook = new ExcelJS.Workbook();
    // Loads the file buffer directly from memory into the workbook. The req.file.buffer is automatically populated by multer when using memoryStorage, which holds the uploaded file in memory.
    await workbook.xlsx.load(req.file.buffer); // Using file buffer from memory
    // await workbook.xlsx.readFile(filePath); // use only when file saved in our code in storage

    // After loading the Excel file, workbook.worksheets[0] accesses the first sheet (index 0) of the Excel file.
    const worksheet = workbook.worksheets[0];

    // Extract Column Headers
    const columnMap = {};
    // Retrieves the first row of the worksheet (row 1 is typically used for column headers). and Iterates over each cell in the first row. It gets the value of the cell and maps it to its column number (colNumber).
    // This is stored in the columnMap object with the cell's value as the key and the column number as the value.
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      columnMap[cell.value?.toString().trim()] = colNumber;
    });

    // This loop ensures that the required columns (Name, Age, Position, Email) are present in the first row of the worksheet.
    for (const col of ["Name", "Age", "Position", "Email", "Office Days"]) {
      if (!columnMap[col]) {
        throw new Error(`Missing column: ${col} in the uploaded file.`);
      }
    }

    // Extract Data from Excel
    const data = [];
    const emails = [];

    worksheet.eachRow((row, rowIndex) => {
      const email = row.getCell(columnMap["Email"]).value;
      const salary = !!columnMap["Salary"]
        ? row.getCell(columnMap["Salary"]).value
        : Number(row.getCell(columnMap["Office Days"]).value) * 800;
      if (rowIndex !== 1) {
        data.push({
          name: row.getCell(columnMap["Name"]).value,
          age: row.getCell(columnMap["Age"]).value,
          position: row.getCell(columnMap["Position"]).value,
          email,
          officeDays: row.getCell(columnMap["Office Days"]).value,
          salary,
        });
        if (email) {
          emails.push(email); // Collect emails for sending later
        }
      }
    });
    if (!!emails.length) {
      sendEmail({
        from: process.env.EMAIL_USER,
        to: emails.join(","),
        subject: "Bulk Employee Upload Notification",
        cc: "bhavsarurvi143@gmail.com",
        bcc: "bhavsarurvi143@gmail.com",
        html: `
          <h1>Employee Data Upload</h1>
          <p>Your employee data has been successfully uploaded to the system.</p>
          <p><strong>Total Records:</strong> ${data.length}</p>
          <p>Thank you for using our employee management system!</p>
        `,
      }).catch((emailError) => {
        // Email error won't crash the server
        console.error("Bulk email notification failed:", emailError);
      });
    }
    // Insert Data into MySQL
    const result = await uploadEmployeeDetails(data);
    res.send({
      message: "Employee details added successfully",
      records: result.affectedRows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error uploading file" });
  }
};

module.exports = {
  createEmployeeHandler,
  getAllEmployeesHandler,
  updateEmployeeHandler,
  deleteEmployeeHandler,
  downloadEmployeeDataHandler,
  handleUploadEmployeeDetails,
  downloadSampleFileHandler,
};
