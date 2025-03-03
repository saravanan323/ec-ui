sap.ui.define([], function () {
	"use strict";

	return {
		URL: {
			//app_endPoint: 'https://inflexion-tech-fzc--hxr6f8z9b87rst6g-dev-ec-srv.cfapps.us10-001.hana.ondemand.com/', //'https://8e193d9atrial-dev-ec-srv.cfapps.us10-001.hana.ondemand.com/',
			app_endPoint: "http://localhost:8082/",

			//s4
			auth_token_cost_rates:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJQQVlSQURNMDAwMSIsImlhdCI6MTcwMDgwNjMwNCwiZXhwIjoxNzAwODMwMzA0fQ.-YWkmd4EZl4zDQGW6dw6_nR2Ag2qeAGxEQWwkOnJPlY",
			gl_post_url:
				"https://my401381-api.s4hana.cloud.sap/sap/bc/srt/scs_ext/sap/journalentrybulkcreationreques?MessageId=",

			s4_hana_cloud_username: "COM_USERAPI",
			s4_hana_cloud_password: "MFQcEdhGQJlez&sUXEsJqjbbJWqtl3kENuAgJSyU",

			//local host
			login: "login",
			enumerators: "enumerators",
			gl_posting: "master/gl-account",
			wbs: "master/wbs",
			activity_types: "master/activity_types",
			cost_centre: "master/cost_centre",
			equipments: "master/equipments",
			cost_rates: "master/cost-rates",

			demands_all: "demands/all",
			demands_by_id: "demands/id/{id}",
			demands_assignments_by_id: "demands/assignments/{id}",
			demands_update_status: "demands/update-status/{status}",
			demands_addEdit: "demands/add-edit",
			demands_addEdit1: "demands/add-edit1",
			demands_search: "demands/criteria",

			demands_count: "demands/status-count",

			//Payflow
			//Project
			project_all: "payflow/project/filter",
			project_search: "payflow/project/search",
			project_by_id: "payflow/project/{id}",
			//wbs element
			wbs_all: "payflow/master/wbs-element/filter",
			wbs_search: "payflow/master/wbs-element/search",

			//Masters
			customer: "payflow/master/customer/filter",
			customer_search: "payflow/master/customer/search",
			customer_by_id: "payflow/master/customer/{id}",
			supplier_by_id: "payflow/master/supplier/{id}",
			supplier_all: "payflow/master/supplier/filter",
			currency: "payflow/master/currency/all",
			company_all: "payflow/master/company/all",
			company_by_id: "payflow/master/company/{id}",

			//Purchase Order
			purchase_orders_all: "payflow/project/purchase-order/filter",
			purchase_orders_fetch: "payflow/project/purchase-order/group/filter",
			purchase_order_by_id: "payflow/project/purchase-order/{id}",

			//Sales Order
			sales_orders_all: "payflow/project/sales-order/filter",
			sales_order_by_id: "payflow/project/sales-order/{id}",

			// Payment Application
			payment_application_all: "payflow/payment-application/all",
			payment_application_by_filter: "payflow/payment-application/filter",
			payment_application_by_id: "payflow/payment-application/{id}",
			payment_application_add: "payflow/payment-application/add",
			payment_application_update: "payflow/payment-application/update",
		},
		Paging: {
			page_size: 50,
		},
	};
});
