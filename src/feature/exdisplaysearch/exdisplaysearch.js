import BaseFeature from '../../foundation/base/base';
import TemplateLoader from '../../foundation/template-loader/template-loader';
import { updateQueryStringParameter, getQueryParameters } from '../../foundation/urlquery/urlquery';

const CONFIG = {
	NUM_PRODUCTS_PAGE: 32,
}

class ExDisplaySearch extends BaseFeature {
	constructor(element) {
		super(element)

		this.countriesElm = document.querySelectorAll('.js-single-store');
		this.storeNameElm = document.querySelector('.js-store-name');
		this.storeTextElm = document.querySelector('.js-store-text');
		this.selectStoreTooltip = document.querySelector('.js-select-store-tooltip');
		this.selectedStore = {};
		
		this.init();
	}

	init() {
		this.countriesElm.forEach(el => {
			el.addEventListener('click', e => {
				this.publish('store-selected', e.currentTarget.dataset);
			})
		});

		this.subscribe('store-selected', dataset => {
			this.selectedStore = dataset;

			this.renderTooltip();
			this.renderProducts();
			this.renderSelectedCountry();
			this.renderUrl();
			this.renderStoreTitle();
			this.renderStoreText();
		});
		
		this.getInitialQuery();
	}

	renderTooltip() {
		if (this.selectedStore.storeId != '') {
			this.selectStoreTooltip.style.display = 'none';
		}
	}

	renderProducts() {
		let productsElm = document.querySelectorAll('.js-single-product');

		if (productsElm) {
			productsElm.forEach(e => {
				e.parentNode.removeChild(e);
			});
		};

		let newProducts = this.getProducts(this.selectedStore.storeId);

		let singleProduct = TemplateLoader('single-product-template', newProducts);
		this.selectStoreTooltip.insertAdjacentHTML('afterend', singleProduct);
	}

	getInitialQuery() {
		let queryParameters = getQueryParameters();

		if (queryParameters != null) {
			this.countriesElm.forEach(el => {
				if (queryParameters.store === el.dataset.storeId) {
					this.publish('store-selected', el.dataset);
				}
			})
		}
	}

	renderSelectedCountry() {
		this.countriesElm.forEach(el => {
			el.style.fontWeight = el.dataset.storeId === this.selectedStore.storeId ? 'bold' : 'normal';
		});
	}

	renderUrl() {
		updateQueryStringParameter("store", this.selectedStore.storeId);
	}

	renderStoreTitle() {
		this.storeNameElm.innerHTML = this.selectedStore.storeName
	}

	renderStoreText() {
		let html = TemplateLoader('store-text-template', this.selectedStore);
		this.storeTextElm.innerHTML = html;
	}

	getProducts(storeId) {
		
		if (storeId === '{1ACCEF5C-155A-42BD-ABD7-E0BC395292F4}') {
			return [
				{
					Name: 'Ishøj sofa 1'
				},
				{
					Name: 'Ishøj sofa 2'
				}
			]
		}

		if (storeId === '{D5FD4537-0DC3-4253-B35E-5ED59B326CF8}') {
			return [
				{
					Name: 'Århus sofa 1'
				},
				{
					Name: 'Århus sofa 2'
				},
				{
					Name: 'Århus sofa 3'
				}
			]
		}

		if (storeId === '{E7902239-773A-4466-975F-5F27CA757F1B}') {
			return [
				{
					Name: 'København sofa 1'
				},
				{
					Name: 'København sofa 2'
				},
				{
					Name: 'København sofa 3'
				},
				{
					Name: 'København sofa 4'
				}
			]
		}
	}
}

export default ExDisplaySearch;