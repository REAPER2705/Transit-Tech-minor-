// CSV Import utility for handling fleet data imports
// Supports Shift 1 and Shift 2 isolated imports

export const parseCSV = (fileContent) => {
  const lines = fileContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) return { headers: [], rows: [] };

  const headers = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    return headers.reduce((obj, header, i) => {
      obj[header] = values[i] || '';
      return obj;
    }, {});
  });

  return { headers, rows };
};

export const validateBusData = (rows) => {
  const errors = [];
  const valid = [];

  rows.forEach((row, index) => {
    const lineNum = index + 2;
    const rowErrors = [];

    if (!row['Bus ID'] || !row['Bus ID'].trim()) {
      rowErrors.push('Bus ID is required');
    }
    if (!row['Capacity'] || isNaN(parseInt(row['Capacity']))) {
      rowErrors.push('Capacity must be a valid number');
    }
    if (parseInt(row['Capacity']) < 10 || parseInt(row['Capacity']) > 200) {
      rowErrors.push('Capacity must be between 10 and 200');
    }

    if (rowErrors.length > 0) {
      errors.push({ line: lineNum, errors: rowErrors });
    } else {
      valid.push({
        id: row['Bus ID'],
        capacity: parseInt(row['Capacity']),
        status: row['Status'] || 'ACTIVE',
      });
    }
  });

  return { valid, errors };
};

export const validateRouteData = (rows) => {
  const errors = [];
  const valid = [];

  rows.forEach((row, index) => {
    const lineNum = index + 2;
    const rowErrors = [];

    if (!row['Route ID'] || !row['Route ID'].trim()) {
      rowErrors.push('Route ID is required');
    }
    if (!row['Route Name'] || !row['Route Name'].trim()) {
      rowErrors.push('Route Name is required');
    }
    if (!row['Distance'] || isNaN(parseFloat(row['Distance']))) {
      rowErrors.push('Distance must be a valid number');
    }

    if (rowErrors.length > 0) {
      errors.push({ line: lineNum, errors: rowErrors });
    } else {
      valid.push({
        id: row['Route ID'],
        name: row['Route Name'],
        distance: parseFloat(row['Distance']),
        estimatedDuration: row['Duration'] ? parseInt(row['Duration']) : 30,
        description: row['Description'] || '',
      });
    }
  });

  return { valid, errors };
};

export const validateTimetableData = (rows, shift) => {
  const errors = [];
  const valid = [];

  rows.forEach((row, index) => {
    const lineNum = index + 2;
    const rowErrors = [];

    if (!row['Route ID'] || !row['Route ID'].trim()) {
      rowErrors.push('Route ID is required');
    }
    if (!row['Departure Time'] || !row['Departure Time'].match(/\d{2}:\d{2}/)) {
      rowErrors.push('Departure Time must be in HH:MM format');
    }

    if (rowErrors.length > 0) {
      errors.push({ line: lineNum, errors: rowErrors });
    } else {
      valid.push({
        routeId: row['Route ID'],
        departureTime: row['Departure Time'],
        shift: shift,
        status: 'SCHEDULED',
      });
    }
  });

  return { valid, errors };
};

export const generateSampleCSV = (type) => {
  let csv = '';

  switch (type) {
    case 'buses':
      csv = `Bus ID,Capacity,Status
G-50,50,ACTIVE
G-51,50,ACTIVE
G-52,45,ACTIVE`;
      break;
    case 'routes':
      csv = `Route ID,Route Name,Distance,Duration,Description
ROUTE-03,South Campus Loop,9.5,35,Southern facilities access
ROUTE-04,North Extension,11.2,40,Northern academic blocks`;
      break;
    case 'timetables':
      csv = `Route ID,Departure Time
ROUTE-01,08:20
ROUTE-02,09:00
ROUTE-01,10:30`;
      break;
    case 'staff':
      csv = `Staff ID,Name,Role,Bus ID,Shift
STAFF-003,Deepak Sharma,DRIVER,G-50,SHIFT-1
STAFF-004,Priya Verma,CONDUCTOR,G-50,SHIFT-1`;
      break;
    default:
      csv = '';
  }

  return csv;
};

export const downloadCSV = (content, filename) => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const createImportReport = (type, validCount, errorCount, errors) => {
  return {
    type,
    timestamp: new Date().toISOString(),
    summary: {
      total: validCount + errorCount,
      valid: validCount,
      errors: errorCount,
      successRate: Math.round((validCount / (validCount + errorCount)) * 100),
    },
    errors: errors,
  };
};
