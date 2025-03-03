sap.ui.define(
	[
		"com/ecui/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/m/Popover",
		"sap/m/Button",
		"sap/m/library",
		"sap/ui/Device",
		"sap/ui/core/Popup",
		"sap/ui/core/Fragment",
		"sap/m/Dialog",
		"sap/m/library",
		"sap/f/library",
	],
	function (
		BaseController,
		JSONModel,
		Popover,
		Button,
		library,
		Device,
		Popup,
		Fragment,
		Dialog,
		mobileLibrary,
		fioriLibrary,
	) {
		"use strict";
		// shortcut for sap.m.ButtonType
		var ButtonType = mobileLibrary.ButtonType;

		// shortcut for sap.m.DialogType
		var DialogType = mobileLibrary.DialogType;

		return BaseController.extend("com.ecui.controller.AppUnified", {
			onInit: function () {
				this.byId("toolPage").setSideExpanded(false);

				this.oOwnerComponent = this.getOwnerComponent();
				this.oRouter = this.oOwnerComponent.getRouter();
				this.oSideNavModel =
					this.getOwnerComponent().getModel("sideNavigation");

				this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			},
			onRouteMatched: function (oEvent) {
				var sRouteName = oEvent.getParameter("name"),
					oArguments = oEvent.getParameter("arguments");

				delete oArguments.layout;

				this._updateUIElements();
				this.userSettingsData();

				// Save the current route name
				this.currentRouteName = sRouteName;
				this.currentArgs = oArguments;
			},

			onStateChanged: function (oEvent) {
				var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
					sLayout = oEvent.getParameter("layout");

				this._updateUIElements();

				// Replace the URL with the new layout if a navigation arrow was used
				if (bIsNavigationArrow) {
					this.oRouter.navTo(
						this.currentRouteName,
						{ layout: sLayout, ...this.currentArgs },
						true,
					);
				}
			},

			// Update the close/fullscreen buttons visibility
			_updateUIElements: function () {
				var oModel = this.oOwnerComponent.getModel(),
					oUIState;
				this.oOwnerComponent.getHelper().then(function (oHelper) {
					oUIState = oHelper.getCurrentUIState();
					oModel.setData(oUIState);
				});
			},

			onExit: function () {
				this.oRouter.detachRouteMatched(this.onRouteMatched, this);
				this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
			},
			onPressLogo: function () {
				this.onPressHome();
			},
			//Side menu item select
			onItemSelect: function (oEvent) {
				var oItem = oEvent.getParameter("item"),
					oNextUIState;
				if (oItem.getKey() != undefined && oItem.getKey() != "") {
					if (oItem.getKey().includes("{layout}")) {
						let navKey = oItem.getKey().replace("/{layout}", "");
						this.getOwnerComponent()
							.getHelper()
							.then(
								function (oHelper) {
									oNextUIState = oHelper.getNextUIState(1);
									this.oRouter.navTo(navKey, {
										layout: fioriLibrary.LayoutType.MidColumnFullScreen, //oNextUIState.layout
									});
								}.bind(this),
							);
					} else {
						this.getRouter().navTo(oItem.getKey());
						this.getRouter().getTargets().display(oItem.getKey());
					}
				} else {
					this.getRouter().getTargets().display("NotFound");
				}
			},

			//handleMenuPress Function is used to show the details of menu
			handleMenuPress: function (oEvent) {
				var oToolPage = this.byId("toolPage");
				var bSideExpanded = oToolPage.getSideExpanded();

				oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
			},
			getNavTitle: function (oKey) {
				if (oKey != undefined && oKey != null && oKey != "") {
					let sectionTitles = {
						1: "Liner Services",
						2: "C&F Services",
						3: "Other Services",
						4: "Finance",
						5: "Admin",
					};
					return sectionTitles[oKey];
				}
			},
		});
	},
);
