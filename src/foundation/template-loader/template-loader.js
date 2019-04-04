export default function TemplateLoader(templateName, data) {
  let template = document.getElementById(templateName);
  let dataArray = data;

  if (!template) {
    console.error('TemplateLoader  (#' + templateName + '): ID not present in DOM.');
    return;
  }

  if (typeof data !== 'object') {
    if (!data) {
      console.warn('TemplateLoader: Data parameter is undefined. This will not populate template ('+templateName+') with anything');
      return;
    }
    console.error('TemplateLoader (#' + templateName + '): Data parameter is not an object or array');
    return;
  }

  let templateHtml = template.innerHTML.trim();

  // If data is not an array, create an array of objects
  if (!Array.isArray(data)) {
    dataArray = [];
    dataArray.push(data);
  }

  templateHtml = dataArray.map((data) => {
    let templateWithData = templateHtml;
    
    for (const prop in data) {
      if (!data.hasOwnProperty(prop)) continue;

      templateWithData = templateWithData.replace(new RegExp('{' + prop + '}', 'gi'), data[prop]);
    }

    return templateWithData;
  });

  return templateHtml.join('');
}