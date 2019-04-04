import TemplateLoader from './template-loader';

document.body.innerHTML = `<div>
  <script id="template-name" type="text/template">
    <h1 class="title">{title}</h1>
    <div class="description">{description}</div>
    <a href="{href}">{linkText}</a>
  </script>
</div>`;

describe('Template Loader', () => {
	it('it can populate data from object', () => {
    const data = {
      title: 'This is my title',
      description: 'This is the description',
      href: 'http://google.com',
      linkText: 'Go to google'
    };

    const result = TemplateLoader('template-name', data);

    expect(result).toEqual(expect.not.stringContaining('{'));
    expect(result).toEqual(expect.not.stringContaining('}'));
  });
});