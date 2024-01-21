import getInstance from './foreign/cmoacommon';

(async function() {
	const {http} = await getInstance();
	(await Promise.all([...document.querySelectorAll('div.category_line>div')]
		.filter(x => x.innerText == 'ISBN')
		.map(x => x.parentElement)
		.map(field => ({field, pre: field.querySelector('pre')}))
		.filter(({pre}) => pre)
		.map(async ({field, pre}) => ({field, pages: await getPages(http, pre.innerText)}))
	)).forEach(({field, pages}) => field.after(template(pages || '不明')));
}());

async function getPages(http, isbn) {
	const r = await http.fetch(`https://bookmeter.com/search?keyword=${isbn}&partial=true&type=japanese_v2&page=1`);
	const text = await r.text();
	const doc = new DOMParser().parseFromString(text, "text/html");

	const div = doc.querySelector('.book__detail .detail__page');
	if (!div) return 0;

	return Number(div.innerText);
}

function template(value) {
	return new DOMParser().parseFromString(`
	<div class="category_line">
	<div class="category_line_f_l_l">ページ数</div>
	<div class="category_line_f_r_l">
		<span class="margin_r5">：</span>
		<pre style="display:inline">${value}</pre>
	</div>
	</div>`, 'text/html').body.firstElementChild;
}