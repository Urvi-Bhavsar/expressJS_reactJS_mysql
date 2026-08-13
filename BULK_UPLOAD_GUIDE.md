# Bulk Employee Upload Guide

## Overview
The Employee Management System now supports bulk import of employee data via Excel files. This feature allows you to add multiple employees at once instead of entering them one by one.

## Features

### ✅ Sample Template Download
- Pre-formatted Excel template with correct column headers
- Includes sample data for reference
- Contains detailed instructions in a separate sheet
- Validates all data on upload

### ✅ Data Validation
- All fields are validated against the same rules as manual entry
- Age: 18-999, whole number
- Name: Max 10 characters
- Position: Max 16 characters
- Email: Must be valid and unique, ending with .com, .io, or .in
- Office Days: 1-31
- Salary: Auto-calculated if not provided (Office Days × 800)

### ✅ Error Handling
- Clear error messages if template format is wrong
- Identifies missing required columns
- Validates each row before inserting

## How to Use

### Step 1: Download Sample Template

1. Navigate to the Employee List page
2. Click the **"Download Sample Template"** button (green button)
3. Save the file: `Employee_Upload_Template.xlsx`

### Step 2: Review the Template

The downloaded file contains two sheets:

#### **Employee Template Sheet**
Contains sample data with the following columns:
- **Name** (Required) - Employee full name
- **Age** (Required) - Employee age (18+)
- **Position** (Required) - Job title
- **Email** (Required) - Valid email address
- **Office Days** (Required) - Working days per month
- **Salary** (Optional) - Will be auto-calculated if empty

#### **Instructions Sheet**
Contains detailed instructions on:
- How to fill the template
- Validation rules
- Example format
- Troubleshooting tips

### Step 3: Fill in Your Data

1. Open the `Employee_Upload_Template.xlsx` file
2. Go to the **"Employee Template"** sheet
3. **Delete or replace the sample data** (rows 2-4)
4. Enter your employee data following the format

**Important:**
- ⚠️ Do NOT modify the header row (row 1)
- ⚠️ Keep all column headers exactly as they are
- ⚠️ All fields except "Salary" are required
- ⚠️ Each email must be unique

### Step 4: Save and Upload

1. Save your Excel file
2. Go back to the Employee List page
3. Click **"Import Employee Details"** button
4. Select your filled template file
5. Wait for the upload to complete

### Step 5: Verify

- Check the success message
- Employee list will refresh automatically
- All imported employees will appear in the table

## Sample Data Format

```
Name       | Age | Position   | Email                  | Office Days | Salary
-----------|-----|------------|------------------------|-------------|--------
John Doe   | 30  | Developer  | john.doe@example.com   | 22          | 17600
Jane Smith | 28  | Designer   | jane.smith@example.io  | 20          | 16000
Bob Wilson | 35  | Manager    | bob.wilson@example.in  | 24          | 19200
```

## Validation Rules

### Name
- Required
- Maximum 10 characters
- Cannot be empty or only spaces

### Age
- Required
- Must be a whole number
- Minimum: 18
- Maximum: 999
- Maximum 3 digits

### Position
- Required
- Maximum 16 characters
- Cannot be empty or only spaces

### Email
- Required
- Must be valid email format
- Must end with .com, .io, or .in
- Must be unique (no duplicates in database)

### Office Days
- Required
- Must be a whole number
- Minimum: 1
- Maximum: 31
- Maximum 2 digits

### Salary
- Optional
- If left empty, will be auto-calculated as: Office Days × 800
- If provided, must be a number

## Common Errors and Solutions

### Error: "Missing column: [column name] in the uploaded file"
**Solution:** 
- The template structure was modified
- Download a fresh template
- Do not rename or delete column headers

### Error: "Name is required" / "Email is required", etc.
**Solution:**
- Check for empty cells in required columns
- Remove any rows that are completely empty
- Ensure all required fields are filled

### Error: "Email must end with .com, .io, or .in"
**Solution:**
- Check email format
- Ensure emails end with allowed domains
- Example: john@example.com ✅ | john@example.org ❌

### Error: "Age must be at least 18"
**Solution:**
- Verify age values are 18 or higher
- Check for typos in age column

### Error: "Office Days cannot exceed 31"
**Solution:**
- Office Days should be between 1 and 31
- Represents working days in a month

### Error: File upload fails silently
**Solution:**
- Check file format is .xlsx (not .xls or .csv)
- Ensure file is not corrupted
- Try downloading a fresh template

## Tips for Success

1. **Start Small**
   - Test with 2-3 employees first
   - Verify they appear correctly
   - Then upload larger batches

2. **Keep Backups**
   - Download existing employee data before bulk upload
   - Keep original source file

3. **Check Data Quality**
   - Remove duplicate emails before upload
   - Verify all ages are valid
   - Ensure names and positions fit length limits

4. **Use Sample Data**
   - Reference the provided sample rows
   - Follow the exact format
   - Pay attention to data types

5. **Review Instructions**
   - Read the Instructions sheet in the template
   - It contains helpful examples
   - Explains all validation rules

## Excel Tips

### Copy from Another Source
If you have employee data in another format:

1. Download the sample template
2. Copy your data
3. Paste into the template (starting at row 2)
4. Verify column alignment
5. Check data format matches requirements

### Formula for Salary
If you want to calculate salary in Excel:
```
=E2*800
```
(Where E2 is the Office Days cell)

### Data Validation in Excel
You can add Excel data validation to prevent errors:

**For Age (must be 18+):**
1. Select age column
2. Data → Data Validation
3. Allow: Whole number
4. Data: between 18 and 999

**For Office Days (1-31):**
1. Select office days column
2. Data → Data Validation
3. Allow: Whole number
4. Data: between 1 and 31

## API Endpoint

If you want to upload programmatically:

```bash
POST http://localhost:4000/upload-employee-details
Content-Type: multipart/form-data

file: [Excel file]
```

Response:
```json
{
  "message": "Employee details added successfully",
  "records": 3
}
```

## Features Roadmap

Potential future enhancements:
- CSV file support
- Duplicate detection and merge options
- Preview before import
- Bulk update existing employees
- Import history and rollback
- Column mapping for custom formats

## Support

If you encounter issues:
1. Check the console for detailed error messages
2. Verify your template matches the sample
3. Review the validation rules above
4. Try with a fresh template download
5. Test with sample data first

## Summary

| Action | Button | Description |
|--------|--------|-------------|
| Download Template | 🟢 Download Sample Template | Get Excel template with format |
| View Instructions | Open Instructions sheet | Detailed guide in Excel file |
| Upload Data | Import Employee Details | Upload filled template |
| Download Data | Download Employee Data | Export current employees |

**The bulk upload feature saves time and reduces errors when adding multiple employees!** 🎉
