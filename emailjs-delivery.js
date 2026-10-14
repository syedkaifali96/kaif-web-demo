(function (global) {
  'use strict';
  async function sendKaifInquiry(values, config, fetcher) {
    if (!config || !config.enabled || !config.serviceId || !config.templateId || !config.publicKey) {
      throw new Error('The custom email connection is not configured yet.');
    }
    const request = {
      service_id: config.serviceId,
      template_id: config.templateId,
      user_id: config.publicKey,
      template_params: {
        name: String(values.name || '').trim(),
        email: String(values.email || '').trim(),
        service: String(values.service || '').trim(),
        budget: String(values.budget || 'Not decided yet').trim(),
        timeline: String(values.timeline || 'Not specified').trim(),
        message: String(values.message || '').trim()
      }
    };
    if (!request.template_params.name || !request.template_params.email || request.template_params.message.length < 10) {
      throw new Error('Please review the required inquiry details.');
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await (fetcher || global.fetch.bind(global))('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request), signal: controller.signal
      });
      if (!response.ok) throw new Error('The inquiry could not be sent. Your details are still available; please try again.');
      return { accepted: true };
    } finally {
      clearTimeout(timeout);
    }
  }
  global.sendKaifInquiry = sendKaifInquiry;
})(window);
