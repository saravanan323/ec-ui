sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/Element",
		"sap/m/Button",
		"sap/ui/core/Fragment",
		"sap/m/Dialog",
		"sap/m/library",
		"com/ecui/utils/AppConstants",
	],
	function (
		Controller,
		History,
		JSONModel,
		Element,
		Button,
		Fragment,
		Dialog,
		mobileLibrary,
		AppConstants,
	) {
		"use strict";
		// shortcut for sap.m.ButtonType
		var ButtonType = mobileLibrary.ButtonType;

		// shortcut for sap.m.DialogType
		var DialogType = mobileLibrary.DialogType;
		return Controller.extend("com.ecui.controller.BaseController", {
			onInit: function () {
				//console.log("test")
			},
			getRouter: function () {
				return sap.ui.core.UIComponent.getRouterFor(this);
			},
			showChatBot: function (obj) {
				var chat_id = document.getElementById("cai-webchat-div");
				if (chat_id != undefined) {
					if (obj == true) chat_id.style.display = "block";
					else chat_id.style.display = "none";
				}
			},
			renderRecastChatbot: function () {
				if (!document.getElementById("cai-webchat")) {
					var s = document.createElement("script");

					s.setAttribute("id", "cai-webchat");

					s.setAttribute("src", "https://cdn.cai.tools.sap/webchat/webchat.js");

					document.body.appendChild(s);
				}

				var c = document.getElementById("cai-webchat");

				c.setAttribute("channelId", "aa3c9270-740c-4b04-b731-6f3c0842643c");

				c.setAttribute("token", "d47e8fee91ba8ac4c51ef9d3ea9bbd2f");
			},
			/**
			 * Convenience method for getting the view model by name.
			 * @public
			 * @param {string} [sName] the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel: function (sName) {
				return this.getView().getModel(sName);
			},

			/**
			 * Convenience method for setting the view model.
			 * @public
			 * @param {sap.ui.model.Model} oModel the model instance
			 * @param {string} sName the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel: function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},

			/**
			 * Getter for the resource bundle.
			 * @public
			 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
			 */
			getResourceBundle: function (text) {
				return this.getOwnerComponent()
					.getModel("i18n")
					.getResourceBundle()
					.getText(text);
			},
			onNavBack: function () {
				var oHistory, sPreviousHash;

				oHistory = History.getInstance();
				sPreviousHash = oHistory.getPreviousHash();

				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					this.getRouter().navTo("dashboard", {}, true /*no history*/);
				}
			},
			genericTitle: function (oTitle) {
				//Page title
				this.oModel.getData().genericTitle = oTitle;
				this.oModel.refresh(true);
			},
			encode: function (value) {
				return btoa(value);
			},
			decode: function (value) {
				return atob(value);
			},
			setStorage: function (name, sContext) {
				jQuery.sap.require("jquery.sap.storage");
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
				oStorage.put(name, sContext);
			},
			getStorage: function (name) {
				jQuery.sap.require("jquery.sap.storage");
				var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
				return oStorage.get(name);
			},

			generateGUUID: function name(params) {
				// Generate a GUID using sap.ui.core.UUID
				// var guid = sap.ui.core.UUID.createRandomUUID();
				var guid = globalThis.crypto.randomUUID();
				return guid;
			},
			///************API Calls***********///

			//SOAP
			restMethodPostBySOAP: function (url, request) {
				let that = this;
				let guuid = ""; // this.generateGUUID();
				url = url + guuid;
				let userName = AppConstants.URL.s4_hana_cloud_username;
				let password = AppConstants.URL.s4_hana_cloud_password;
				var deferred = $.Deferred();
				$.ajax({
					method: "POST",
					url: url,
					crossDomain: true,
					headers: {
						"Content-type": "application/soap+xml; charset=utf-8",
						Authorization: "Basic " + btoa(userName + ":" + password),
					},
					data: request.toString(),
					contentType: "application/text",
					success: function (response) {
						deferred.resolve(response);
					},
					error: function (xhr) {
						deferred.reject(xhr);
					},
				});
				return deferred.promise();
			},
			//
			restMethodGetWithDataTypeText: function (url, request) {
				url = AppConstants.URL.app_endPoint + url;
				// var contexts = this.getStorage("userContext");
				var token = AppConstants.URL.auth_token_cost_rates;
				// if (contexts != null)
				// token = contexts.sessionID;
				if (!request) {
					request = "";
				}
				var deferred = $.Deferred();
				$.ajax({
					type: "POST",
					url: url,
					contentType: "text/plain",
					headers: { Authorization: token },
					data: request,
					success: function (response) {
						deferred.resolve(response);
					},
					error: function (xhr) {
						deferred.reject(xhr.responseJSON.message);
					},
				});
				return deferred.promise();
			},
			restMethodGet: function (url) {
				url = AppConstants.URL.app_endPoint + url;
				var contexts = this.getStorage("userContext");
				var token = "";
				if (contexts != null) token = contexts.sessionID;

				var deferred = $.Deferred();
				$.ajax({
					type: "GET",
					url: url,
					contentType: "application/json",
					//headers: { Authorization: "Bearer " + token },
					success: function (response) {
						deferred.resolve(response);
					},
					error: function (xhr) {
						deferred.reject(xhr.responseJSON.message);
					},
				});
				return deferred.promise();
			},
			restMethodGetWitData: function (url, request) {
				url = AppConstants.URL.app_endPoint + url;
				var deferred = $.Deferred();
				$.ajax({
					type: "POST",
					url: url,
					contentType: "application/json",
					data: JSON.stringify(request),
					//headers: { Authorization: "Bearer " + token },
					success: function (response) {
						deferred.resolve(response);
					},
					error: function (xhr) {
						deferred.reject(xhr.responseJSON.message);
					},
				});
				return deferred.promise();
			},
			restMethodGetWitSOAPData: function (url, request) {
				url = AppConstants.URL.app_endPoint + url;
				var deferred = $.Deferred();
				$.ajax({
					type: "POST",
					url: url,
					contentType: "application/json",
					data: request,
					//headers: { Authorization: "Bearer " + token },
					success: function (response) {
						deferred.resolve(response);
					},
					error: function (xhr) {
						deferred.reject(xhr.responseJSON.message);
					},
				});
				return deferred.promise();
			},
			restMethodPost: function (url, request) {
				url = AppConstants.URL.app_endPoint + url;
				// var contexts = GenericFunctions.getStorage("userContext");
				var contexts = null;
				var token = "";
				if (contexts !== null) token = contexts.sessionID;

				var deferred = $.Deferred();
				$.ajax({
					type: "POST",
					url: url,
					data: JSON.stringify(request),
					contentType: "application/json",
					headers: { Authorization: "Bearer " + token },
					beforeSend: function (xhr) {
						xhr.setRequestHeader("Authorization", "Bearer " + token);
					},
					success: function (response) {
						deferred.resolve(response);
					},
					error: function (xhr) {
						deferred.reject(xhr.responseJSON.message);
					},
				});
				return deferred.promise();
			},
			///************API Calls End***********///
			showLoading: function (status) {
				this.getView().setBusy(status);
			},
			onResetAdaptFilter: function (oSource) {
				//its alternative for reset todo: future will remove this
				//reset adapt filter options
				let that = this;
				let oSettingMdl = this.getOwnerComponent().getModel("settings");
				oSettingMdl.getData().visible_filter = that._defaultAFOption;
				oSettingMdl.refresh(true);
				oSource.getFilterGroupItems().forEach((e) => {
					let findLbl = that._defaultAFOption.find(
						(e1) => e.getLabel() == Object.keys(e1)[0],
					);
					if (findLbl) {
						e.setVisibleInFilterBar(findLbl[e.getLabel()]);
					}
				});
			},
			handlePersoButtonPressed: function () {
				this._persoDialog;
				this._persoDialogTable;
				if (!this._persoDialog) {
					this._persoDialog = sap.ui.xmlfragment(
						"com.ecui.view.fragment.TablePersoDialog",
						this,
					);
					this._persoDialog.setModel(
						new JSONModel(
							this.getOwnerComponent().getModel("settings").getData(),
						),
						"settings",
					);
					this._persoDialogTable = this._persoDialog
						.getCustomTabs()[0]
						.getContent()[0];
					this._persoDialogTable.selectAll();
				}
				this._persoDialog.open();
			},
			handleTablePersoDialogConfirm: function (oEvent) {
				//Handle Table Perso Confirm functionality
				let oTable = this._tableId,
					pTable = this._persoDialogTable;
				if (pTable) {
					this.selItems = pTable?.getSelectedItems();
					let oModel = this.getModel();
					oModel.getData().tablePersoSelected = this.selItems;
					if (this.selItems && this.selItems.length > 0 && !this.persoReset) {
						let colNames = this.selItems.map((e) =>
							e.getCells()[0].getProperty("text"),
						);
						this._tableId.getColumns().forEach((e) => {
							let colName = colNames.some(
								(e1) => e1 == e.getHeader().getText(),
							);
							if (colName) {
								e.setVisible(true);
							} else {
								e.setVisible(false);
							}
						});
					} else if (this.persoReset) {
						this._tableId.getColumns().forEach((e) => e.setVisible(true));
						this.persoReset = false;
					} else {
						this._tableId.getColumns().forEach((e, i) => {
							let headerText = e.getHeader().getText();
							if (headerText == "ID") {
								//i == 0 &&
								let setSelected = pTable
									.getItems()
									.find((e) => e.getCells()[0].getText() == "ID");
								pTable.setSelectedItem(pTable.getItems()[0]);
								e.setVisible(true);
							} else {
								e.setVisible(false);
							}
						});
					}
					oModel.refresh(true);
				}
			},
			async onOpenDialog(sPath) {
				//Common dialog open function
				if (this.oDialog) {
					this.oDialog.destroy();
					delete this.oDialog;
				}
				if (!this.oDialog) {
					this.oDialog = await this.loadFragment({
						name: sPath,
					});
				}

				this.oDialog.open(); //Open Dialog
				return this.oDialog;
			},
			onCloseDialog: async function () {
				//Common dialog close function
				if (this.oDialog && this.oDialog.close) {
					this.oDialog.close(); //Close Dialog
					this.oDialog.destroy();
					delete this.oDialog;
				}
			},
			getDateWithFormat: function (da) {
				if (da) {
					da = da.split("T")?.[0];
					var d = new Date(da),
						month = "" + (d.getMonth() + 1),
						day = "" + d.getDate(),
						year = d.getFullYear();
					if (month.length < 2) month = "0" + month;
					if (day.length < 2) day = "0" + day;
					return [year, month, day].join("-");
				} else return null;
			},

			getCurrentDateWithFormat: function () {
				var d = new Date(),
					month = "" + (d.getMonth() + 1),
					day = "" + d.getDate(),
					year = d.getFullYear();
				if (month.length < 2) month = "0" + month;

				if (day.length < 2) day = "0" + day;
				return [year, month, day].join("-");
			},
			getUtcDate: function (val) {
				if (val) {
					var dateString = val.substr(6);

					var d = new Date(parseInt(dateString)),
						month = "" + (d.getMonth() + 1),
						day = "" + d.getDate(),
						year = d.getFullYear();

					if (month.length < 2) {
						month = "0" + month;
					}
					if (day.length < 2) {
						day = "0" + day;
					}
					// return [day, month, year].join("-");
					return [year, month, day].join("-");
				} else {
					return "";
				}
			},
			toDateFormat: function (date) {
				if (date) {
					return new Date(date).toLocaleDateString().replace(/\//g, "-");
				} else {
					//
				}
			},
			JsonToDate: function (date) {
				if (date) {
					return new Date(
						parseInt(date.toLocaleString().substr(6)),
					).toLocaleDateString();
				} else {
					return "";
				}
			},
			tofixed: function (val) {
				if (val) {
					var getData = +val;
					return getData.toFixed(3);
				} else {
					return "";
				}
			},
			onPressHome: function () {
				this.getRouter().navTo("dashboard");
			},
			//Set Title
			setTitle: function (title) {
				/* let oModel = this.getModel();
        oModel.getData().genericTitle = title
        oModel.refresh(); */
			},
			/* Date Formate Change */
			getDateFormats(key, date) {
				let oModel = this.getModel();
				let userSettings = oModel.getData().userSettings;
				let dateConv, fDate;
				if (date != undefined) {
					//date.slice(date.indexOf("(") + 1, date.indexOf(")"))
					dateConv = new Date(date);

					let options = {
						year: "numeric",
						month: "short",
						day: "numeric",
					};
					let numeric = function () {
						//Numeric
						options.month = "2-digit";
						options.day = "2-digit";
						fDate = dateConv.toLocaleDateString("en-IN", options);
						fDate = fDate.replaceAll("/", " ");
						userSettings.dateFormat = "dd-MM-yyyy";
					};
					if (key == 1) {
						numeric();
					} else if (key == 2) {
						//Short
						options.month = "short";
						options.day = "2-digit";
						fDate = dateConv.toLocaleDateString("en-IN", options);
						userSettings.dateFormat = "dd-MMM-yyyy";
					} else if (key == 3) {
						//Long
						options.month = "long";
						options.day = "2-digit";
						fDate = dateConv.toLocaleDateString("en-IN", options);
						userSettings.dateFormat = "dd-MMMM-yyyy";
					} else {
						numeric();
					}
					return fDate.replaceAll(" ", "-");
				} else {
					//dateConv = new Date();
				}
			},

			/* Time Format Change */
			getTimeFormats: function (key, time) {
				let oModel = this.getModel();
				let userSettings = oModel.getData().userSettings;

				if (time != undefined) {
					let date = new Date().toLocaleDateString("en-IN", {
						month: "long",
						day: "numeric",
						year: "numeric",
					});
					let timeConv = new Date();
					timeConv.setTime(new Date(date + ", " + time).getTime());

					if (key == 1) {
						userSettings.timeFormat = "hh:mm:ss a";
						return timeConv.toLocaleTimeString("en-IN", {
							hour12: true,
						});
					} else if (key == 2) {
						userSettings.timeFormat = "HH:mm:ss";
						return timeConv.toLocaleTimeString("en-IN", {
							hour12: false,
						});
					}
				}
			},
			//on Apply theme
			onApplyTheme: function (key) {
				if (key) {
					sap.ui.getCore().applyTheme(key);
					sap.ui.getCore().attachThemeChanged(function (oEvent) {
						console.log(oEvent.getParameters());
					});
				}
			},

			//LogOut Dialog
			onPressLogOut: function () {
				var that = this;
				if (!this.oApproveDialog) {
					this.oApproveDialog = new Dialog({
						type: DialogType.Message,
						title: "Confirm",
						content: new sap.m.Text({
							text: "Are you sure you want to log off?",
						}),
						beginButton: new Button({
							type: ButtonType.Emphasized,
							text: "OK",
							press: function () {
								//this.showChatBot(false);
								// this.getRouter().navTo('login');
								this.oApproveDialog.close();
								var that = this;
								if (
									window.location.toString().indexOf("localhost") > 0 ||
									window.location.toString().indexOf("127.0.0.1") > 0 ||
									window.location.toString().indexOf("applicationstudio") > 0
								) {
									that.getView().setModel(new JSONModel(), "userDetaisMdl");
									that.showChatBot(false);
									that.getRouter().navTo("Login");
									that.oApproveDialog.close();
								} else {
									document.cookie.split(";").forEach(function (cookie) {
										var eqPos = cookie.indexOf("=");
										var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
										document.cookie =
											name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
									});
									let path = that.getOwnerComponent().getManifestObject()
										._oBaseUri._parts.path;
									sap.m.URLHelper.redirect(path + "/Logout.html", false);
								}
							}.bind(this),
						}),
						endButton: new Button({
							text: "Cancel",
							press: function () {
								this.oApproveDialog.close();
							}.bind(this),
						}),
					});
				}

				this.oApproveDialog.open();
			},
			//Menu popover
			menuPopoverOpen: function (oEvent) {
				var oButton = oEvent.getSource(),
					oView = this.getView();

				// create popover
				if (!this._menuPopover) {
					this._menuPopover = Fragment.load({
						id: oView.getId(),
						name: "com.ecui.view.fragment.MenuButton",
						controller: this,
					}).then(function (oPopover) {
						oView.addDependent(oPopover);
						return oPopover;
					});
				}
				this._menuPopover.then(function (oPopover) {
					oPopover.openBy(oButton);
				});
			},
			/*  menuPopoverClose: function () {
         if (this.errorMessage != undefined) {
           this.errorMessage.then(function (oPopover) {
             oPopover.close();
           });
         }
       }, */

			//Error popover button handler
			handleMessagePopoverPress: function (oEvent) {
				let isDialog = false;
				let oSource;
				if (oEvent?.oSource) {
					oSource = oEvent.getSource();
				} else {
					oSource = oEvent;
				}
				if (!this.errorMessage) {
					this.errorMessagePopover(oSource, isDialog);
				}
				this.errorMessage.then(function (oPopover) {
					oPopover.toggle(oSource);
				});
			},

			//Error Popover Start
			// errorMessagePopover: function (popoverBtn) {
			//   //Popover
			//   if (!this.errorMessage) {
			//     this.errorMessage = this.loadFragment({
			//       name: "com.ecui.view.fragment.ErrorMessage"
			//     }, this);
			//   }
			//   this.errorMessage.then(function (oPopover) {
			//     oPopover.toggle(popoverBtn);
			//   });
			// },
			errorMessagePopover: function (oSource, isDialog) {
				//Popover
				let oButton = oSource;
				isDialog = isDialog;
				if (!this.errorMessage) {
					this.errorMessage = this.loadFragment(
						{
							name: "com.ecui.view.fragment.ErrorMessage",
						},
						this,
					);
				}
				this.errorMessage.then(function (oPopover) {
					oButton.addDependent(oPopover);
					oPopover.toggle(oButton);
				});
			},
			errorMessagePopoverClose: function () {
				if (this.errorMessage != undefined) {
					this.errorMessage.then(function (oPopover) {
						oPopover.close();
					});
				}
			},
			///************API Calls End***********///
			errorHandling: function (ex) {
				var that = this;
				if (!this.errorData) {
					this.errorData = [];
				}
				let eModel = this.getOwnerComponent().getModel("errors");
				if (ex) {
					if (ex.responseJSON?.debugMessage) {
						this.errorData.push(
							that.customErrorObject(
								ex.responseJSON.debugMessage,
								that.pageId,
								null,
							),
						);
					} else if (ex.responseJSON?.errorDescription) {
						this.errorData.push(
							that.customErrorObject(
								ex.responseJSON.errorDescription,
								that.pageId,
								null,
							),
						);
					} else if (ex.responseJSON) {
						this.errorData.push(
							that.customErrorObject(ex.responseJSON.error, that.pageId, null),
						);
					} else if (ex.status) {
						this.errorData.push(
							that.customErrorObject(
								ex.status + " " + ex.statusText,
								that.pageId,
								null,
							),
						);
					} else {
						this.showLoading(false);

						this.errorData.push(
							that.customErrorObject(ex.message, that.pageId, null),
						);
					}
				}
				let merge = [...eModel.getData(), ...this.errorData];
				eModel.setData(merge);

				if (merge.length) {
					that.errorMessagePopover(that.popoverBtn, false);
				}
				that.showLoading(false);
			},

			// onActiveTitlePress: function (oEvent) {
			//   var getSelItem = oEvent.getParameter('item').getBindingContext('errors').getObject();
			//   var control = getSelItem.control;
			//   var oPage = getSelItem.page;
			//   var oControl = Element.registry.get(control.getId());

			//   if (oControl) {
			//     oPage.scrollToElement(oControl.getDomRef(), 200, [0, -100]);
			//     setTimeout(function () {
			//       oControl.focus();
			//     }, 300);
			//     var type = oControl.getAccessibilityInfo().type;
			//     if (type == "Checkbox") {
			//       var text = oControl.getText();
			//       var oPopover = new sap.m.Popover({
			//         showHeader: false,
			//         placement: "Bottom",
			//         content: [new sap.m.Text({
			//           text: text,
			//           width: "auto"
			//         }).addStyleClass("sapUiTinyMargin")]
			//       });
			//       oPopover.openBy(oControl);
			//     }
			//   }
			// },
			onActiveTitlePress: function (oEvent) {
				var getSelItem = oEvent
					.getParameter("item")
					.getBindingContext("errors")
					.getObject();
				var control = getSelItem.control;
				var oPage = getSelItem.page;
				var oControl = Element.registry.get(control.getId());

				if (oControl) {
					jQuery.sap.delayedCall(500, this, function () {
						oControl.focus();
					});
					var type = oControl.getAccessibilityInfo().type;
					if (type == "Checkbox") {
						var text = oControl.getText();
						var oPopover = new sap.m.Popover({
							showHeader: false,
							placement: "Bottom",
							content: [
								new sap.m.Text({
									text: text,
									width: "auto",
								}).addStyleClass("sapUiTinyMargin"),
							],
						});
						oPopover.openBy(oControl);
					}
				}
			},
			customErrorObject: function (
				errorMessages,
				pageId,
				oControl,
				description,
			) {
				return {
					type: "Error",
					active: true,
					control: oControl,
					title: errorMessages,
					subTitle: null,
					description: description,
					page: pageId,
				};
			},
			//Error Popover End

			//Advanced Filter Settings Dialog
			onPressAFSettings: function () {
				var that = this;
				if (!this.afSettingsDialog) {
					this.afSettingsDialog = this.loadFragment(
						{
							name: "com.ecui.view.fragment.AdvancedFilterSettings",
						},
						this,
					);
				}
				this.afSettingsDialog.then(function (oDialog) {
					oDialog.open();
				});
			},
			onCloseAFSettings: function () {
				this.afSettingsDialog.then(function (oDialog) {
					oDialog.close();
				});
			},
			userSettingsData: function () {
				if (
					!this.getView().getModel() ||
					!this.getView().getModel()?.getData()
				) {
					this.getView().setModel(new JSONModel());
				}
				//Themes and User Settings
				let settings = this.getStorage("userSettings");
				let oData = {
					themes: [
						{
							key: "sap_bluecrystal",
							name: "Blue Crystal",
						},
						{
							key: "sap_belize",
							name: "Belize",
						},
						{
							key: "sap_fiori_3",
							name: "Quartz Light",
						},
						{
							key: "sap_fiori_3_dark",
							name: "Quartz Dark",
						},
						{
							key: "sap_horizon",
							name: "Morning Horizon",
						},
						{
							key: "sap_horizon_dark",
							name: "Evening Horizon",
						},
					],
					timeFormat: [
						{
							key: 1,
							name: "12 Hours",
						},
						{
							key: 2,
							name: "24 Hours",
						},
					],
					dateFormat: [
						{
							key: 1,
							name: "Numeric",
						},
						{
							key: 2,
							name: "Short",
						},
						{
							key: 3,
							name: "Long",
						},
					],
					language: [
						{
							key: "en",
							name: "English",
						},
						{
							key: "ar",
							name: "Arabic",
						},
					],
					userSettings: {
						theme: "sap_fiori_3",
						language: "en",
						dateFormatKey: 1,
						timeFormatKey: 1,
						dateFormat: "dd-MM-yyyy",
						timeFormat: "HH:mm a",
					},
				};
				let oModel = this.getView().getModel();
				let existData = oModel.getData();
				let merge = {
					...existData,
					...oData,
				};
				oModel.setData(merge);

				oModel.getData().userSettings.currentDate = this.getDateFormats(
					1,
					new Date(),
				);
				oModel.getData().userSettings.currentTime = this.getTimeFormats(
					1,
					new Date().toLocaleTimeString(),
				);

				if (settings) {
					oModel.getData().userSettings = settings;
					this.setStorage("userSettings", settings);
					this.onApplyTheme(settings.theme);
				} else {
					this.setStorage("userSettings", oData.userSettings);
				}
				oModel.refresh();
			},
			//User Settings Dialog
			onPressUserSetting: function () {
				var that = this;
				if (!this.userSettingsDialog) {
					this.userSettingsDialog = this.loadFragment(
						{
							name: "com.ecui.view.fragment.UserSettings",
						},
						this,
					);
				}
				this.userSettingsDialog.then(function (oDialog) {
					var listTheme = that.byId("dg_listThemes");
					var settings = that.getStorage("userSettings");
					listTheme.getItems().forEach((e) => {
						let key = e.getBindingContext().getObject().key;
						if (key == settings.theme) {
							listTheme.setSelectedItem(e);
						}
					});
					oDialog.open();
					that.userSettingsData();
				});
			},
			onCloseUserSetting: function () {
				this.userSettingsDialog.then(function (oDialog) {
					oDialog.close();
				});
			},
			onPressUserDialogMenu: function (oEvent) {
				let splitContainer = this.byId("userSettingsSplitContainer");
				splitContainer.backMaster();
			},
			//on Theme Selection
			onThemSelect: function (oEvent) {
				var oModel = this.getModel();
				var selThemObj = oEvent
					.getParameter("listItem")
					.getBindingContext()
					.getObject();

				oModel.getData().userSettings.theme = selThemObj.key;
				this.onApplyTheme(selThemObj.key);
				oModel.refresh();
			},
			// on Language Selection
			onChangeLanguage: function (oEvent) {
				var oModel = this.getModel();
				var coreConfig = sap.ui.getCore().getConfiguration();
				var selThemObj = oEvent
					.getParameter("selectedItem")
					.getBindingContext()
					.getObject();

				oModel.getData().userSettings.language = selThemObj.key;
				sap.ui.getCore().attachLocalizationChanged(function (oEvent) {
					console.log(oEvent.getParameters());
				});

				coreConfig.setLanguage(selThemObj.key);

				oModel.refresh();
			},
			// on Change Date Format for Entire Application
			onChangeApplicationDate: function (oEvent) {
				var oModel = this.getModel();
				var oKey = oEvent.getParameter("selectedItem").getKey();
				oModel.getData().userSettings.currentDate = this.getDateFormats(
					oKey,
					new Date(),
				);
				oModel.refresh();
				// this.setStorage("userSettings", oModel.getData().userSettings)
			},
			// on Change Time Format for Entire Application
			onChangeApplicationTime: function (oEvent) {
				var oModel = this.getModel();
				var oKey = oEvent.getParameter("selectedItem").getKey();
				oModel.getData().userSettings.currentTime = this.getTimeFormats(
					oKey,
					new Date().toLocaleTimeString(),
				);
				oModel.refresh();
			},
			onPressSaveSettings: function (oEvent) {
				var oModel = this.getModel();
				this.setStorage("userSettings", oModel.getData().userSettings);
				this.userSettingsDialog.then(function (oDialog) {
					oDialog.close();
				});
			},
			onListItemPress: function (oEvent) {
				var sToPageId = oEvent
					.getParameter("listItem")
					.getCustomData()[0]
					.getValue();
				var sContainer = this.getView().byId("userSettingsSplitContainer");
				sContainer.toDetail(this.createId(sToPageId));
			},
			disableItemNavigated: function (oTable) {
				if (oTable) {
					oTable.getItems().forEach((e) => e.setNavigated(false));
				}
			},
			onOpenPopover: async function (oEvent, sPath) {
				//Common popover open function
				let oButton = oEvent, //.getSource(),
					oView = this.getView();

				if (this.oPopover) {
					this.oPopover.destroy();
					delete this.oPopover;
				}

				this.oPopover = await this.loadFragment({
					name: sPath,
				});
				oView.addDependent(this.oPopover);

				let errorMsg = sPath.includes("ErrorMessage");
				if (!errorMsg) {
					this.oPopover.openBy(oButton); //Open Popover
				} else {
					this.oPopover.toggle(oButton); //Toggle Popover
				}
			},
			onMenuPopoverOpen: function (oEvent) {
				this.onOpenPopover(
					oEvent.getSource(),
					"com.ecui.view.fragment.MenuButton",
				);
			},
			onNotificationOpen: function (oEvent) {
				this.onOpenPopover(
					oEvent.getSource(),
					"com.ecui.view.fragment.Notification",
				);
			},
		});
	},
);
