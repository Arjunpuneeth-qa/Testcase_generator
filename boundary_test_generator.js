#!/usr/bin/env node

/**
 * Boundary Value Test Case Generator
 * Generates comprehensive boundary validation test cases
 * Added to all generators for enhanced edge case coverage
 *
 * Includes:
 * - Numeric boundaries (min, max, overflow)
 * - String boundaries (length, special chars)
 * - Date boundaries (min, max, invalid)
 * - Array boundaries (empty, single, max)
 * - Format validation
 * - Injection attacks
 * - Null/undefined handling
 */

const BOUNDARY_TEST_TEMPLATES = {
  // ============================================================================
  // NUMERIC BOUNDARY TESTS
  // ============================================================================

  numericMinimum: {
    TC_ID: 'BV_NUM_001',
    'Test Scenario': 'Verify field accepts minimum allowed value',
    'Test Type': 'Boundary - Numeric Minimum',
    'Pre-Condition': 'Number input field is accessible; Field minimum is defined',
    'Test Steps': `• Navigate to the numeric input field
• Determine the minimum allowed value from requirements
• Enter the minimum value (e.g., 0, -999999, 1)
• Submit the form
• Verify the value is accepted and saved
• Verify no error message is displayed`,
    'Test Data': 'Minimum allowed numeric value (e.g., 0 for age, 1 for quantity)',
    'Expected Result': 'Minimum value is accepted, saved, and displayed correctly',
    'Brief Description': 'Test minimum numeric boundary',
    'Status': ''
  },

  numericMaximum: {
    TC_ID: 'BV_NUM_002',
    'Test Scenario': 'Verify field accepts maximum allowed value',
    'Test Type': 'Boundary - Numeric Maximum',
    'Pre-Condition': 'Number input field is accessible; Field maximum is defined',
    'Test Steps': `• Navigate to the numeric input field
• Determine the maximum allowed value (e.g., 100, 999999)
• Enter the maximum value
• Submit the form
• Verify the value is accepted and saved
• Verify no error message is displayed`,
    'Test Data': 'Maximum allowed numeric value (e.g., 100 for percentage, 120 for age)',
    'Expected Result': 'Maximum value is accepted, saved, and displayed correctly',
    'Brief Description': 'Test maximum numeric boundary',
    'Status': ''
  },

  numericBelowMinimum: {
    TC_ID: 'BV_NUM_003',
    'Test Scenario': 'Verify field rejects value below minimum',
    'Test Type': 'Boundary - Below Minimum',
    'Pre-Condition': 'Number field with minimum constraint; Error validation enabled',
    'Test Steps': `• Navigate to the numeric input field
• Enter value just below minimum (e.g., minimum is 0, enter -1)
• Submit the form
• Verify error message is displayed
• Verify data is NOT saved
• Check error message is clear and helpful`,
    'Test Data': 'Value below minimum (minimum: 0, test with: -1 or -100)',
    'Expected Result': 'Value is rejected with clear error message; Data not saved',
    'Brief Description': 'Test value below minimum boundary',
    'Status': ''
  },

  numericAboveMaximum: {
    TC_ID: 'BV_NUM_004',
    'Test Scenario': 'Verify field rejects value above maximum',
    'Test Type': 'Boundary - Above Maximum',
    'Pre-Condition': 'Number field with maximum constraint; Error validation enabled',
    'Test Steps': `• Navigate to the numeric input field
• Determine the maximum (e.g., 100)
• Enter value just above maximum (e.g., 101)
• Submit the form
• Verify error message is displayed
• Verify data is NOT saved`,
    'Test Data': 'Value above maximum (maximum: 100, test with: 101 or 999999)',
    'Expected Result': 'Value is rejected with clear error message; Data not saved',
    'Brief Description': 'Test value above maximum boundary',
    'Status': ''
  },

  numericZero: {
    TC_ID: 'BV_NUM_005',
    'Test Scenario': 'Verify field handles zero value correctly',
    'Test Type': 'Boundary - Zero Value',
    'Pre-Condition': 'Numeric field is accessible',
    'Test Steps': `• Navigate to the numeric input field
• Enter zero (0)
• Submit the form
• Verify if zero is allowed (depends on field)
• Check system behavior with zero value`,
    'Test Data': 'Zero (0)',
    'Expected Result': 'System handles zero correctly (accepts or rejects per requirements)',
    'Brief Description': 'Test zero value handling',
    'Status': ''
  },

  numericNegative: {
    TC_ID: 'BV_NUM_006',
    'Test Scenario': 'Verify field handles negative numbers correctly',
    'Test Type': 'Boundary - Negative Values',
    'Pre-Condition': 'Numeric field that may receive negative values',
    'Test Steps': `• Navigate to the numeric input field
• Enter negative value (e.g., -50, -100.50)
• Submit the form
• Verify if negative is allowed per requirements
• Check proper handling and display`,
    'Test Data': 'Negative numbers (-1, -50, -999.99)',
    'Expected Result': 'Negative values handled correctly per requirements',
    'Brief Description': 'Test negative number handling',
    'Status': ''
  },

  numericDecimal: {
    TC_ID: 'BV_NUM_007',
    'Test Scenario': 'Verify field handles decimal values correctly',
    'Test Type': 'Boundary - Decimal Precision',
    'Pre-Condition': 'Numeric field that accepts decimal values',
    'Test Steps': `• Navigate to numeric field (e.g., price, percentage)
• Enter decimal value with various precisions
• Test: 1 decimal place (1.5)
• Test: 2 decimal places (1.50)
• Test: 3 decimal places (1.500)
• Submit and verify storage and display
• Check rounding behavior`,
    'Test Data': 'Decimal values: 1.5, 1.50, 1.500, 99.99, 0.01, 0.001',
    'Expected Result': 'Decimal values stored and displayed with correct precision',
    'Brief Description': 'Test decimal precision handling',
    'Status': ''
  },

  numericOverflow: {
    TC_ID: 'BV_NUM_008',
    'Test Scenario': 'Verify field handles extremely large numbers',
    'Test Type': 'Boundary - Numeric Overflow',
    'Pre-Condition': 'Numeric field with data type constraints',
    'Test Steps': `• Navigate to numeric input field
• Enter extremely large number (e.g., 999999999999)
• Enter number exceeding int32 limit (> 2,147,483,647)
• Enter number exceeding int64 limit
• Submit and verify handling
• Check for overflow errors or truncation`,
    'Test Data': 'Large numbers: 999999999999, 2147483648, 9223372036854775808',
    'Expected Result': 'System handles or rejects overflow with appropriate error',
    'Brief Description': 'Test numeric overflow handling',
    'Status': ''
  },

  // ============================================================================
  // STRING BOUNDARY TESTS
  // ============================================================================

  stringMinimumLength: {
    TC_ID: 'BV_STR_001',
    'Test Scenario': 'Verify field accepts minimum string length',
    'Test Type': 'Boundary - String Minimum Length',
    'Pre-Condition': 'Text input field with minimum length constraint',
    'Test Steps': `• Navigate to the text input field
• Determine minimum length (e.g., 3 characters)
• Enter minimum required characters
• Submit the form
• Verify the value is accepted and saved`,
    'Test Data': 'String at minimum length (e.g., "ABC" for min 3 chars)',
    'Expected Result': 'Minimum length string is accepted and saved',
    'Brief Description': 'Test minimum string length',
    'Status': ''
  },

  stringMaximumLength: {
    TC_ID: 'BV_STR_002',
    'Test Scenario': 'Verify field accepts maximum string length',
    'Test Type': 'Boundary - String Maximum Length',
    'Pre-Condition': 'Text input field with maximum length constraint',
    'Test Steps': `• Navigate to the text input field
• Determine maximum length (e.g., 255 characters)
• Enter exactly maximum number of characters
• Submit the form
• Verify the value is accepted and saved`,
    'Test Data': 'String at maximum length (255 chars, max allowed for field)',
    'Expected Result': 'Maximum length string is accepted and saved',
    'Brief Description': 'Test maximum string length',
    'Status': ''
  },

  stringBelowMinimum: {
    TC_ID: 'BV_STR_003',
    'Test Scenario': 'Verify field rejects string shorter than minimum',
    'Test Type': 'Boundary - Below Minimum Length',
    'Pre-Condition': 'Text field with minimum length; Validation enabled',
    'Test Steps': `• Navigate to text input field (min length = 5)
• Enter string with fewer chars (e.g., "Hi")
• Submit the form
• Verify error message is displayed
• Verify data is NOT saved`,
    'Test Data': 'String below minimum (min: 5 chars, test with: "Hi")',
    'Expected Result': 'String rejected with clear error; Data not saved',
    'Brief Description': 'Test string below minimum length',
    'Status': ''
  },

  stringAboveMaximum: {
    TC_ID: 'BV_STR_004',
    'Test Scenario': 'Verify field rejects string exceeding maximum',
    'Test Type': 'Boundary - Exceeds Maximum Length',
    'Pre-Condition': 'Text field with maximum length; Validation enabled',
    'Test Steps': `• Navigate to text input field (max 50 chars)
• Enter string exceeding maximum (51+ chars)
• Submit the form
• Verify error or truncation occurs
• Check system behavior`,
    'Test Data': 'String exceeding max (max: 50, test: 100 character string)',
    'Expected Result': 'String rejected or truncated; User notified',
    'Brief Description': 'Test string exceeding maximum length',
    'Status': ''
  },

  stringEmpty: {
    TC_ID: 'BV_STR_005',
    'Test Scenario': 'Verify field handles empty string correctly',
    'Test Type': 'Boundary - Empty String',
    'Pre-Condition': 'Text input field; May be required or optional',
    'Test Steps': `• Navigate to text input field
• Leave field empty (no characters)
• Submit the form
• Verify if field is required
• Check error message if applicable`,
    'Test Data': 'Empty string ("")',
    'Expected Result': 'Empty string handled per requirements (error if required)',
    'Brief Description': 'Test empty string handling',
    'Status': ''
  },

  stringWhitespace: {
    TC_ID: 'BV_STR_006',
    'Test Scenario': 'Verify field handles whitespace-only strings',
    'Test Type': 'Boundary - Whitespace Only',
    'Pre-Condition': 'Text input field with validation',
    'Test Steps': `• Navigate to text input field
• Enter only spaces (5-10 spaces)
• Submit the form
• Verify field rejects or trims whitespace
• Check validation behavior`,
    'Test Data': 'Whitespace only ("     " - 5 spaces)',
    'Expected Result': 'Whitespace-only string is rejected or trimmed',
    'Brief Description': 'Test whitespace-only string handling',
    'Status': ''
  },

  stringSpecialCharacters: {
    TC_ID: 'BV_STR_007',
    'Test Scenario': 'Verify field handles special characters correctly',
    'Test Type': 'Boundary - Special Characters',
    'Pre-Condition': 'Text input field with special character constraints',
    'Test Steps': `• Navigate to text input field
• Enter various special characters
• Test: @ # $ % & * ( ) - _ = + [ ] { } | ; : ' " < > , . ? /
• Test: Unicode characters (é, ñ, 中文)
• Submit and verify handling
• Check for injection vulnerabilities`,
    'Test Data': 'Special chars: @#$%&*()[]{}|;:\'\"<>,.?/ and Unicode',
    'Expected Result': 'Special characters handled safely or rejected appropriately',
    'Brief Description': 'Test special character handling',
    'Status': ''
  },

  stringSQLInjection: {
    TC_ID: 'BV_STR_008',
    'Test Scenario': 'Verify field is protected against SQL injection',
    'Test Type': 'Security - SQL Injection',
    'Pre-Condition': 'Database-connected field; Input validation active',
    'Test Steps': `• Navigate to text input field
• Enter SQL injection payloads:
  • ' OR '1'='1
  • '; DROP TABLE users; --
  • ' UNION SELECT * FROM users --
  • ); DELETE FROM users; --
• Submit and verify safe handling
• Check that malicious SQL is escaped/rejected
• Verify database integrity`,
    'Test Data': 'SQL injection payloads: \' OR \'1\'=\'1, DROP TABLE, UNION SELECT',
    'Expected Result': 'SQL payloads are escaped/rejected; Database unharmed',
    'Brief Description': 'Test SQL injection protection',
    'Status': ''
  },

  stringXSSInjection: {
    TC_ID: 'BV_STR_009',
    'Test Scenario': 'Verify field is protected against XSS attacks',
    'Test Type': 'Security - Cross-Site Scripting (XSS)',
    'Pre-Condition': 'Web form field; Output displayed on page',
    'Test Steps': `• Navigate to text input field
• Enter XSS payloads:
  • <script>alert('XSS')</script>
  • <img src=x onerror=alert('XSS')>
  • <svg onload=alert('XSS')>
  • javascript:alert('XSS')
  • <iframe src="javascript:alert('XSS')">
• Submit and verify safe handling
• Check that scripts are not executed
• Verify output is properly escaped`,
    'Test Data': 'XSS payloads: <script>, <img onerror>, <svg onload>, etc.',
    'Expected Result': 'XSS payloads are escaped/sanitized; Scripts not executed',
    'Brief Description': 'Test XSS attack protection',
    'Status': ''
  },

  // ============================================================================
  // DATE BOUNDARY TESTS
  // ============================================================================

  dateMinimumValue: {
    TC_ID: 'BV_DATE_001',
    'Test Scenario': 'Verify field accepts minimum date value',
    'Test Type': 'Boundary - Date Minimum',
    'Pre-Condition': 'Date input field with minimum date constraint',
    'Test Steps': `• Navigate to date input field
• Determine minimum allowed date (e.g., 1900-01-01)
• Enter the minimum date
• Submit the form
• Verify the date is accepted and saved`,
    'Test Data': 'Minimum date (e.g., 01/01/1900 or 1900-01-01)',
    'Expected Result': 'Minimum date is accepted and saved correctly',
    'Brief Description': 'Test minimum date boundary',
    'Status': ''
  },

  dateMaximumValue: {
    TC_ID: 'BV_DATE_002',
    'Test Scenario': 'Verify field accepts maximum date value',
    'Test Type': 'Boundary - Date Maximum',
    'Pre-Condition': 'Date input field with maximum date constraint',
    'Test Steps': `• Navigate to date input field
• Determine maximum allowed date (e.g., 12/31/2099)
• Enter the maximum date
• Submit the form
• Verify the date is accepted and saved`,
    'Test Data': 'Maximum date (e.g., 12/31/2099 or 2099-12-31)',
    'Expected Result': 'Maximum date is accepted and saved correctly',
    'Brief Description': 'Test maximum date boundary',
    'Status': ''
  },

  dateInvalidFormat: {
    TC_ID: 'BV_DATE_003',
    'Test Scenario': 'Verify field rejects invalid date formats',
    'Test Type': 'Boundary - Invalid Date Format',
    'Pre-Condition': 'Date field with format validation',
    'Test Steps': `• Navigate to date input field (expects MM/DD/YYYY)
• Enter various invalid formats:
  • DD/MM/YYYY (wrong order)
  • YYYY-MM-DD (wrong separator)
  • 13/45/2023 (invalid month/day)
  • 32/02/2023 (invalid day for month)
  • 2023/13/01 (invalid month)
• Verify error messages
• Verify dates are not saved`,
    'Test Data': 'Invalid formats: 32/02/2023, 13/45/2020, wrong separators',
    'Expected Result': 'Invalid date formats are rejected with clear error',
    'Brief Description': 'Test invalid date format handling',
    'Status': ''
  },

  dateLeapYearBoundary: {
    TC_ID: 'BV_DATE_004',
    'Test Scenario': 'Verify field handles leap year dates correctly',
    'Test Type': 'Boundary - Leap Year',
    'Pre-Condition': 'Date validation enabled; Supports leap year dates',
    'Test Steps': `• Navigate to date input field
• Test leap year dates:
  • Valid: 02/29/2020 (leap year)
  • Valid: 02/29/2024 (leap year)
  • Invalid: 02/29/2021 (not leap year)
  • Invalid: 02/29/2023 (not leap year)
• Verify correct acceptance/rejection
• Check validation logic`,
    'Test Data': 'Leap year dates: 02/29/2020 (valid), 02/29/2021 (invalid)',
    'Expected Result': 'Leap year dates validated correctly per calendar rules',
    'Brief Description': 'Test leap year boundary handling',
    'Status': ''
  },

  // ============================================================================
  // ARRAY/COLLECTION BOUNDARY TESTS
  // ============================================================================

  arrayEmpty: {
    TC_ID: 'BV_ARR_001',
    'Test Scenario': 'Verify field/list handles empty array',
    'Test Type': 'Boundary - Empty Array',
    'Pre-Condition': 'Array/list field or multi-select dropdown',
    'Test Steps': `• Navigate to array/list field (e.g., checkboxes, multi-select)
• Ensure no items are selected
• Submit the form
• Verify if array is required or optional
• Check system behavior with empty array`,
    'Test Data': 'Empty array (no selections)',
    'Expected Result': 'Empty array handled per requirements (error if required)',
    'Brief Description': 'Test empty array handling',
    'Status': ''
  },

  arraySingleItem: {
    TC_ID: 'BV_ARR_002',
    'Test Scenario': 'Verify field handles single-item array correctly',
    'Test Type': 'Boundary - Single Item Array',
    'Pre-Condition': 'Array field with minimum of 1 item required',
    'Test Steps': `• Navigate to array/list field
• Select/enter only 1 item
• Submit the form
• Verify the single item is accepted and saved
• Check system handles single-item case`,
    'Test Data': 'Array with 1 item: ["Item1"]',
    'Expected Result': 'Single item array is accepted and saved',
    'Brief Description': 'Test single-item array handling',
    'Status': ''
  },

  arrayMaximumItems: {
    TC_ID: 'BV_ARR_003',
    'Test Scenario': 'Verify field respects maximum array size',
    'Test Type': 'Boundary - Maximum Array Size',
    'Pre-Condition': 'Array field with maximum item constraint (e.g., max 5 items)',
    'Test Steps': `• Navigate to array/list field (max 5 items)
• Select exactly maximum items
• Verify all items are accepted
• Try to add one more item
• Verify system prevents exceeding maximum
• Check error message`,
    'Test Data': 'Array with maximum items: [Item1, Item2, Item3, Item4, Item5]',
    'Expected Result': 'Maximum items accepted; Additional items rejected',
    'Brief Description': 'Test maximum array size boundary',
    'Status': ''
  },

  // ============================================================================
  // NULL/UNDEFINED BOUNDARY TESTS
  // ============================================================================

  nullValue: {
    TC_ID: 'BV_NULL_001',
    'Test Scenario': 'Verify field handles null value correctly',
    'Test Type': 'Boundary - Null Value',
    'Pre-Condition': 'Optional field that may receive null values',
    'Test Steps': `• Navigate to optional field
• Clear/delete any existing value
• Submit the form without entering data
• Verify null is handled correctly
• Check storage and retrieval of null`,
    'Test Data': 'Null value',
    'Expected Result': 'Null value accepted and stored correctly',
    'Brief Description': 'Test null value handling',
    'Status': ''
  },

  undefinedValue: {
    TC_ID: 'BV_NULL_002',
    'Test Scenario': 'Verify field distinguishes null from undefined',
    'Test Type': 'Boundary - Undefined Value',
    'Pre-Condition': 'Optional field; System tracks undefined vs null',
    'Test Steps': `• Check initial state of field (should be undefined)
• Enter a value (defined)
• Clear the field (now null)
• Verify system distinguishes states
• Check API responses for undefined vs null`,
    'Test Data': 'Undefined (initial state) vs Null (cleared state)',
    'Expected Result': 'System correctly distinguishes undefined from null',
    'Brief Description': 'Test undefined vs null distinction',
    'Status': ''
  }
};

module.exports = {
  BOUNDARY_TEST_TEMPLATES,
  getAllBoundaryTests: () => Object.values(BOUNDARY_TEST_TEMPLATES),
  getBoundaryTestsByCategory: (category) => {
    const categoryMap = {
      numeric: ['BV_NUM_001', 'BV_NUM_002', 'BV_NUM_003', 'BV_NUM_004', 'BV_NUM_005', 'BV_NUM_006', 'BV_NUM_007', 'BV_NUM_008'],
      string: ['BV_STR_001', 'BV_STR_002', 'BV_STR_003', 'BV_STR_004', 'BV_STR_005', 'BV_STR_006', 'BV_STR_007', 'BV_STR_008', 'BV_STR_009'],
      date: ['BV_DATE_001', 'BV_DATE_002', 'BV_DATE_003', 'BV_DATE_004'],
      array: ['BV_ARR_001', 'BV_ARR_002', 'BV_ARR_003'],
      null: ['BV_NULL_001', 'BV_NULL_002']
    };

    const ids = categoryMap[category] || [];
    return ids.map(id => {
      for (const [key, test] of Object.entries(BOUNDARY_TEST_TEMPLATES)) {
        if (test.TC_ID === id) return test;
      }
    }).filter(t => t);
  }
};
