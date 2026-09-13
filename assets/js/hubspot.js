
(function () {
  var PORTAL = '246715076';
  var FORMS = {
    courses: '29ada516-a177-4537-9a37-1414c05967fc',
    grooming: '97b1f021-1d40-4e7a-9a1f-7f03d6b8be5e',
    boarding: '1c032c49-faae-4b39-b788-2263766e49a7'
  };

  function splitName(full) {
    var parts = (full || '').trim().split(/\s+/);
    return { first: parts[0] || '', last: parts.slice(1).join(' ') };
  }

  function f(name, value) {
    return { objectTypeId: '0-1', name: name, value: String(value || '') };
  }

  window.hsSubmit = function (type, data) {
    data = data || {};
    var guid = FORMS[type] || FORMS.grooming;

    // Support both flat data and nested customer payloads from cart checkout
    var customer = data.customer || {};
    var rawName = customer.name || data.name || '';
    var rawEmail = customer.email || data.email || '';
    var rawPhone = customer.phone || data.phone || '';

    var n = splitName(rawName);
    var fields = [
      f('email', rawEmail),
      f('firstname', n.first),
      f('lastname', n.last),
      f('phone', rawPhone)
    ];

    var lines = ['Enquiry type: ' + type];

    if (type === 'checkout') {
      if (data.orderId) lines.push('Order Reference: ' + data.orderId);
      if (customer.area) lines.push('Area / Location: ' + customer.area);
      if (customer.contactMethod) lines.push('Preferred Contact Method: ' + customer.contactMethod);

      if (data.items && data.items.length) {
        lines.push('\n--- Selected Services / Items ---');
        data.items.forEach(function (item) {
          lines.push('• ' + item.title + ' (Qty: ' + (item.quantity || 1) + ') - ' + (item.priceDisplay || ('₹' + item.price)));
        });
      }

      function formatAmount(amt) {
        var num = Number(amt) || 0;
        return num % 1 !== 0 ? num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : num.toLocaleString('en-IN');
      }

      if (data.subtotal) lines.push('Subtotal: ₹' + formatAmount(data.subtotal));
      if (data.mandatoryTrialDayFee) lines.push('Mandatory Trial Day Fee: +₹' + formatAmount(data.mandatoryTrialDayFee));
      if (data.totalAmount) lines.push('Total Amount Estimated: ₹' + formatAmount(data.totalAmount));

      if (data.pets && data.pets.length) {
        lines.push('\n--- Pet Details (' + data.pets.length + ' Pet' + (data.pets.length > 1 ? 's' : '') + ') ---');
        data.pets.forEach(function (pet, idx) {
          lines.push('\n[Pet #' + (idx + 1) + (pet.serviceTitle ? ' · ' + pet.serviceTitle : '') + ']');
          if (pet.name) lines.push('Pet Name: ' + pet.name);
          if (pet.type) lines.push('Pet Type: ' + pet.type);
          if (pet.breed) lines.push('Breed: ' + pet.breed);
          if (pet.age) lines.push('Age: ' + pet.age);
          if (pet.size) lines.push('Size: ' + pet.size);
          if (pet.coat) lines.push('Coat: ' + pet.coat);
          if (pet.temperament) lines.push('Temperament: ' + pet.temperament);
          if (pet.healthNotes) lines.push('Special Needs / Health Notes: ' + pet.healthNotes);
          if (pet.hasCompletedTrialDay !== undefined) lines.push('Completed Previous Trial Day: ' + (pet.hasCompletedTrialDay ? 'Yes' : 'No'));
          if (pet.isSamePetAsPrevious) lines.push('Note: Uses same pet profile as previous slot');
        });
      } else if (data.pet) {
        lines.push('\n--- Pet Details ---');
        if (data.pet.name) lines.push('Pet Name: ' + data.pet.name);
        if (data.pet.type) lines.push('Pet Type: ' + data.pet.type);
        if (data.pet.breed) lines.push('Breed: ' + data.pet.breed);
        if (data.pet.age) lines.push('Age: ' + data.pet.age);
        if (data.pet.size) lines.push('Size: ' + data.pet.size);
        if (data.pet.coat) lines.push('Coat: ' + data.pet.coat);
        if (data.pet.temperament) lines.push('Temperament: ' + data.pet.temperament);
        if (data.pet.healthNotes) lines.push('Special Needs / Health Notes: ' + data.pet.healthNotes);
        lines.push('Completed Previous Trial Day: ' + (data.pet.hasCompletedTrialDay ? 'Yes' : 'No'));
      }

      if (data.appointment) {
        lines.push('\n--- Preferred Schedule ---');
        if (data.appointment.date) lines.push('Date: ' + data.appointment.date);
        if (data.appointment.time) lines.push('Time: ' + data.appointment.time);
        if (data.appointment.notes) lines.push('Notes: ' + data.appointment.notes);
      }
    } else if (type === 'grooming' || type === 'myotherapy') {
      if (data.petName) lines.push('Pet name: ' + data.petName);
      if (data.petType) lines.push('Pet type: ' + data.petType);
      if (data.breed) lines.push('Breed: ' + data.breed);
      if (data.size) lines.push('Size: ' + data.size);
      if (data.coat) lines.push('Coat type: ' + data.coat);
      if (data.temperament) lines.push('Temperament: ' + data.temperament);
      if (data.age) lines.push('Age: ' + data.age);
      if (data.date) lines.push('Preferred date: ' + (new Date(data.date).toString() !== 'Invalid Date' ? new Date(data.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }) : data.date));
      if (data.time) lines.push('Preferred time: ' + data.time);
      if (data.notes) lines.push('Notes: ' + data.notes);
    } else if (type === 'boarding') {
      if (data.breed) lines.push('Dog breed: ' + data.breed);
      if (data.dateFrom) lines.push('Check-in: ' + data.dateFrom);
      if (data.dateTo) lines.push('Check-out: ' + data.dateTo);
    } else if (type === 'courses') {
      if (data.course) lines.push('Course: ' + data.course);
      if (data.notes) lines.push('Notes: ' + data.notes);
    }

    fields.push(f('message', lines.join('\n')));

    // 1. Submit to HubSpot
    fetch(
      'https://api.hsforms.com/submissions/v3/integration/submit/' + PORTAL + '/' + guid,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: fields.filter(function (x) { return x.value; }),
          context: { pageUri: window.location.href, pageName: document.title }
        })
      }
    ).catch(function () { });

    var web3Key;
    if (type === 'myotherapy') {
      var myoKey = window.PawpadContentStore && window.PawpadContentStore.get('myotherapy') && window.PawpadContentStore.get('myotherapy').web3FormsAccessKey;
      web3Key = (myoKey && myoKey !== 'YOUR_ACCESS_KEY_HERE' && myoKey !== 'a9a21b4b-47ee-4889-b709-9f101c59874d')
        ? myoKey
        : 'ce70cafb-d84c-42f7-b57e-d320ff768866';
    } else {
      var crsKey = window.PawpadContentStore && window.PawpadContentStore.get('courses') && window.PawpadContentStore.get('courses').web3FormsAccessKey;
      web3Key = (crsKey && crsKey !== 'YOUR_ACCESS_KEY_HERE' && crsKey !== 'ce70cafb-d84c-42f7-b57e-d320ff768866')
        ? crsKey
        : 'a9a21b4b-47ee-4889-b709-9f101c59874d';
    }
    var web3Subject = (type === 'checkout')
      ? 'New Booking / Order Request: ' + (data.orderId || 'Direct Checkout') + ' (' + (rawName || 'Customer') + ')'
      : 'Pawpad Enquiry: ' + type.toUpperCase() + ' - ' + (rawName || 'Customer');

    var web3Payload = {
      access_key: web3Key,
      subject: web3Subject,
      from_name: 'Pawpad ' + type.charAt(0).toUpperCase() + type.slice(1) + ' Enquiry',
      name: rawName || 'Not specified',
      email: rawEmail || 'Not provided',
      phone: rawPhone || 'Not provided',
      enquiry_type: type,
      details: lines.join('\n'),
      botcheck: ''
    };

    var fd = new FormData();
    Object.keys(web3Payload).forEach(function (k) { fd.append(k, web3Payload[k]); });

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: fd
    }).catch(function (err) {
      console.warn('Pawpad: Web3Forms submission notice:', err);
    });
  };
})();

