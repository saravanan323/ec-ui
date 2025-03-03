sap.ui.define(
    [
        "com/ecui/controller/BaseController",
        "sap/ui/model/json/JSONModel",
        "com/ecui/utils/AppConstants",
        "com/ecui/utils/Formatter",
        "sap/m/MessageBox",
        "com/ecui/utils/ErrorMessage",
        "sap/m/MessageToast",
    ],
    function (
        BaseController,
        JSONModel,
        AppConstants,
        Formatter,
        MessageBox,
        ErrorMessage,
        MessageToast
    ) {
        "use strict";
        return BaseController.extend(
            "com.ecui.confirm_equipment.EquipmentUtilizationDetails",
            {
                formatter: Formatter,
                onInit: function () {
                    this.oOwnerComponent = this.getOwnerComponent();
                    this.oRouter = this.oOwnerComponent.getRouter();
                    this.oModel = this.oOwnerComponent.getModel();
                    this.oRouter
                        .getRoute("equipment-utilization-details")
                        .attachMatched(this._onRouteDetailMatched, this);
                    this.oRouter
                        .getRoute("confirm-equipment-utilization")
                        .attachMatched(this._onRouteMatched, this);

                    this._tableId = this.getView().byId("tableUtil");
                },
                _onRouteMatched: function (oEvent) {
                    this._item = oEvent.getParameter("arguments").id || oEvent.getParameter("arguments").id || null;
                    this._route = oEvent.getParameter("config").name;
                    this.getView().setModel(new JSONModel({ route: this._route, item: this._item }), 'navigationMdl');
                    this.getView().setModel(new JSONModel(), "demandMdl");
                    this.getView().setModel(new JSONModel(), "addConfrimationMdl");
                    this.getView().setModel(new JSONModel(), "costCenterRates");

                    this.errorPopoverParams();
                },
                _onRouteDetailMatched: async function (oEvent) {
                    this._item = oEvent.getParameter("arguments").id || oEvent.getParameter("arguments").id || null;
                    this._route = oEvent.getParameter("config").name;
                    this.getView().setModel(new JSONModel({ route: this._route, item: this._item }), 'navigationMdl');
                    this.getView().setModel(new JSONModel(), "demandMdl");
                    this.getView().setModel(new JSONModel(), "addConfrimationMdl");
                    this.getView().setModel(new JSONModel(), "costCenterRates");

                    this.errorPopoverParams();
                    this.genericTitle("Equipment Utilization Details");
                    this.fetchEquipmentById();
                    //this.onPressConfirm();
                },
                errorPopoverParams: function (formId) {
                    // let ids = {
                    //     basic: "sf_basicDetails",
                    //     attachment: "sf_attachment",
                    //     property: "sf_PropHierarchy",
                    // };
                    // this.formId = this.getView().byId(ids[formId]);
                    this.pageId = this.getView().byId("eqd_detail_page");
                    this.popoverBtn = this.getView().byId("btn_eqdD_error");

                    //******Set Initially Empty Error Mdl******
                    this.eMdl = this.getOwnerComponent().getModel("errors");
                    ErrorMessage.removeValueState(null, this.eMdl);

                    this.eMdl.setData([]);
                    this.errorData = [];
                },
                onPressCancel: function () {
                    this.onNavBack();
                },
                onPressAdd: function (oEvent) {
                    //let selItems = this._tableId.getSelectedItems();
                    // if (selItems.length > 0) {
                    // create dialog lazily
                    var data = oEvent.getSource().getBindingContext("demandMdl").getObject();
                    data.index = oEvent.getSource().getBindingContext("demandMdl").sPath.split('/').pop();
                    this.getView().setModel(new JSONModel(data), "addConfrimationMdl");
                    this.getView().getModel("addConfrimationMdl").refresh(true);
                    this.pDialog ??= this.loadFragment({
                        name: "com.ecui.confirm_equipment.AddConfirmationHours"
                    });

                    this.pDialog.then((oDialog) => oDialog.open());
                    //}
                },
                confirmDate: function (oEvent) {
                    let data = this.getView().getModel("addConfrimationMdl").getData();
                    let orig_data = this.getView().getModel("demandMdl").getData();
                    // orig_data.equipmentDemandAssignments[data.index].date = data.date;
                    // orig_data.equipmentDemandAssignments[data.index].hours = data.hours;
                    //

                    let totalHrs = 0.0;
                    data.confirmedDatesHours.forEach(e => {
                        totalHrs = e.hours ? totalHrs + parseFloat(e.hours) : totalHrs;
                    })
                    orig_data.equipmentDemandAssignments[data.index].totalHours = totalHrs;
                    orig_data.equipmentDemandAssignments[data.index].confirmedDatesHours = data.confirmedDatesHours;

                    // orig_data.equipmentDemandAssignments[data.index].confirmedDatesHours.push(
                    //     {
                    //         date: data.date,
                    //         hours: data.hours
                    //     }
                    // );
                    //

                    this.getView().getModel("demandMdl").refresh(true);
                    this._closeDialog();
                },
                _closeDialog: function () {
                    this.getView().setModel(new JSONModel(), "addConfrimationMdl");
                    this.getView().getModel("addConfrimationMdl").refresh(true);
                    this.pDialog.then((oDialog) => oDialog.close());
                    //this._tableId.removeSelections();
                },
                onPressViewMore: function (oEvent) {
                    var data = oEvent.getSource().getBindingContext("demandMdl").getObject();
                    data.index = oEvent.getSource().getBindingContext("demandMdl").sPath.split('/').pop();
                    this.getView().setModel(new JSONModel(data), "addConfrimationMdl");
                    this.getView().getModel("addConfrimationMdl").refresh(true);

                    // create dialog lazily
                    this.pDialog1 ??= this.loadFragment({
                        name: "com.ecui.confirm_equipment.ConfirmedHours"
                    });

                    this.pDialog1.then((oDialog) => oDialog.open());
                },
                onPressAddInViewMore: function (oEvent) {
                    let addConfrimationMdl = this.getView().getModel("addConfrimationMdl").getData();
                    addConfrimationMdl.confirmedDatesHours.push({
                        date: null,
                        hours: 0.0
                    });
                    this.getView().getModel("addConfrimationMdl").refresh(true);
                },
                onPressDeleteInViewMore: function (oEvent) {
                    let addConfrimationMdl = this.getView().getModel("addConfrimationMdl").getData();
                    var data = oEvent.getSource().getBindingContext("addConfrimationMdl").getObject();
                    let selectedInd = oEvent.getSource().getBindingContext("addConfrimationMdl").sPath.split('/').pop();
                    addConfrimationMdl?.confirmedDatesHours?.splice(selectedInd, 1);
                    this.getView().getModel("addConfrimationMdl").refresh(true);
                },
                _closeViewDialog: function () {
                    let data = this.getView().getModel("addConfrimationMdl").getData();
                    let orig_data = this.getView().getModel("demandMdl").getData();
                    // orig_data.equipmentDemandAssignments[data.index].confirmedDatesHours = data.confirmedDatesHours;

                    let isErr = false;
                    let totalHrs = 0.0;
                    data.confirmedDatesHours.forEach(e => {
                        if (!isErr && (parseFloat(e.hours) >= 0)) {
                            totalHrs = e.hours ? totalHrs + parseFloat(e.hours) : totalHrs;
                        }
                        else {
                            isErr = true;
                        }
                        if (!e.date) {
                            isErr = true;
                        }
                    });
                    if (!isErr) {
                        orig_data.equipmentDemandAssignments[data.index].totalHours = totalHrs;
                        orig_data.equipmentDemandAssignments[data.index].confirmedDatesHours = data.confirmedDatesHours;
                        this.getView().getModel("demandMdl").refresh(true);

                        this.getView().setModel(new JSONModel(), "addConfrimationMdl");
                        this.getView().getModel("addConfrimationMdl").refresh(true);
                        this.pDialog1.then((oDialog) => oDialog.close());
                    } else {

                        MessageToast.show("Date should not be empty and Hours should be in the range between 0.00 to 24.00");
                    }

                    // this._tableId.removeSelections();
                },
                //Full Screen, Exit Full Screen, and Close 
                handleFullScreen: function () {
                    var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
                    this.oRouter.navTo(this._route, { layout: sNextLayout, id: this._item });
                },

                handleExitFullScreen: function () {
                    var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
                    this.oRouter.navTo(this._route, { layout: sNextLayout, id: this._item });
                },

                handleClose: function () {
                    /* var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
                    this.oRouter.navTo("confirm-equipment-utilization", { layout: sNextLayout }); */
                    this.onNavBack();
                },

                onExit: function () {
                    this.oRouter.getRoute("confirm-equipment-utilization").detachPatternMatched(this._onRouteMatched, this);
                    this.oRouter.getRoute(this._route).detachPatternMatched(this._onRouteMatched, this);
                },
                fetchEquipmentById: async function (id) {
                    try {
                        this.showLoading(true);
                        let path = AppConstants.URL.demands_by_id.replace("{id}", this._item);
                        let response = await this.restMethodGet(path);
                        let obj = {};
                        if (response && response?.equipmentDemand) {
                            response.equipmentDemand.wbs_element_id_and_text = stringCon(response?.equipmentDemand?.wbs_element_id, response?.equipmentDemand?.wbs_element_text);
                            response.equipmentDemand.activity_type_id_and_text = stringCon(response?.equipmentDemand?.activity_type_id, response?.equipmentDemand?.activity_type_text);
                            response.equipmentDemand.cost_centre_id_and_text = stringCon(response?.equipmentDemand?.cost_centre_id, response?.equipmentDemand?.cost_centre_text);

                            response.equipmentDemand.demand_start_date = this.getDateWithFormat(response.equipmentDemand.demand_start_date);
                            response.equipmentDemand.deman_end_date = this.getDateWithFormat(response.equipmentDemand.deman_end_date);
                            function stringCon(id, name) {
                                let id_with_name = null;
                                if (id && name) {
                                    id_with_name = id + " - " + name;
                                }
                                else if (id && !name) {
                                    id_with_name = id;
                                }
                                else if (!id && name) {
                                    id_with_name = name;
                                }
                                return id_with_name;
                            }
                            obj = response.equipmentDemand;

                            response.equipmentDemandAssignments.forEach(element => {
                                // element.date = "-";
                                // element.hours = 0.0;
                                element.confirmedDatesHours = [{
                                    date: null,
                                    hours: 0.0
                                }];
                                let totalHrs = 0.0;
                                element.confirmedDatesHours.forEach(e => {
                                    totalHrs = e.hours ? totalHrs + parseFloat(e.hours) : totalHrs;
                                })
                                element.totalHours = totalHrs;

                            });
                            obj.equipmentDemandAssignments = response.equipmentDemandAssignments ? response.equipmentDemandAssignments : [];

                            this.fetchCostCenterRates(response?.equipmentDemand?.cost_centre_id, 1000, response?.equipmentDemand?.activity_type_id);
                        }
                        this.getView().setModel(new JSONModel(obj), "demandMdl");
                        this.getView().getModel("demandMdl").refresh(true);
                        this.showLoading(false);
                    } catch (error) {
                        this.showLoading(false);
                        this.errorHandling(error);
                    }
                },
                fetchCostCenterRates: async function (costCenterId, companyCode, activityTypeId) {
                    try {
                        this.showLoading(true);
                        let path = AppConstants.URL.cost_rates;
                        // let data = "CostCenter ne'' and CompanyCode eq '1000' and ActivityType eq 'SV01'";
                        let data = "CostCenter ne ''";
                        if (costCenterId) {
                            data = data ? data + " and CostCenter eq '" + costCenterId + "'" : "CostCenter eq '" + costCenterId + "'";
                        }
                        if (companyCode) {
                            data = data ? data + " and CompanyCode eq '" + companyCode + "'" : "CompanyCode eq '" + companyCode + "'";
                        }
                        if (activityTypeId) {
                            data = data ? data + " and ActivityType eq '" + activityTypeId + "'" : "ActivityType eq '" + activityTypeId + "'";
                        }
                        let response = await this.restMethodGetWithDataTypeText(path, data);
                        let rates = [];
                        if (response) {
                            rates = response.d?.results;
                        }
                        this.getView().setModel(new JSONModel(rates), "costCenterRates");
                        this.getView().getModel("costCenterRates").refresh();
                        this.showLoading(false);
                    } catch (error) {
                        this.showLoading(false);
                        this.errorHandling(error);
                    }
                },
                onPressSave: async function (oEvent) {
                    let that = this;
                    try {
                        let demandMdl = that.getView().getModel("demandMdl").getData();
                        //   ErrorMessage.formValidation(this.formId, this.eMdl, this.pageId); //Generic Error management model
                        //   let valid = this.eMdl.getData();
                        //   if (valid.length == 0) {
                        this.showLoading(true);
                        this.getModel("errors").setData([]);
                        if (demandMdl?.equipmentDemandAssignments.length > 0) {
                            // demandMdl.equipmentDemandAssignments.forEach(e => {
                            //     if (e.date === "-") {
                            //         e.date = null;
                            //     }
                            // })
                        }
                        let request = {
                            equipmentDemand: demandMdl
                        }
                        this.onPressConfirm();


                    } catch (error) {
                        this.showLoading(false);
                        this.errorHandling(error);
                    }
                },

                onPressConfirm: async function (oEvent) {
                    try {
                        var that = this;
                        let demandMdl = this.getView().getModel("demandMdl").getData();
                        let request = "";
                        let currDate = await this.getCurrentDateWithFormat();
                        let costCenterRates = this.getView().getModel("costCenterRates").getData();

                        let overallHrs = 0.0;
                        let rate = 0;
                        let finalAmount = 0;

                        if (costCenterRates && Array.isArray(costCenterRates)) {

                            if (costCenterRates[0]?.CostRateVarblAmount) {
                                rate = parseFloat(costCenterRates[0]?.CostRateVarblAmount);
                            }

                        }
                        demandMdl.equipmentDemandAssignments.forEach(e => {
                            overallHrs = e.totalHours ? overallHrs + parseFloat(e.totalHours) : overallHrs;
                        });

                        finalAmount = rate * overallHrs;

                        if (finalAmount) {



                            var payload = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:sfin="http://sap.com/xi/SAPSCORE/SFIN"> <soap:Header/> <soap:Body> <sfin:JournalEntryBulkCreateRequest> <MessageHeader> <ID>MSG_' + currDate + '</ID> <!--<ReferenceID></ReferenceID>--> <CreationDateTime>' + currDate + 'T00:00:00Z</CreationDateTime> </MessageHeader> <!--1 or more repetitions:--> <JournalEntryCreateRequest> <MessageHeader> <ID>SUB_MSG_' + currDate + '</ID> <!--<ReferenceID></ReferenceID>--> <CreationDateTime>' + currDate + 'T00:00:00Z</CreationDateTime> </MessageHeader> <JournalEntry> <OriginalReferenceDocumentType>BKPFF</OriginalReferenceDocumentType> <BusinessTransactionType>RFBU</BusinessTransactionType> <AccountingDocumentType>SA</AccountingDocumentType> <DocumentReferenceID>123</DocumentReferenceID> <DocumentHeaderText>' + demandMdl.demand_name + '</DocumentHeaderText> <CreatedByUser>CC0000000002</CreatedByUser> <CompanyCode>1000</CompanyCode> <DocumentDate>' + currDate + '</DocumentDate> <PostingDate>' + currDate + '</PostingDate> <Reference1InDocumentHeader>12345678901234567890</Reference1InDocumentHeader> <Reference2InDocumentHeader>1234567890</Reference2InDocumentHeader> <Item> <!--Optional:--> <ReferenceDocumentItem>1</ReferenceDocumentItem> <GLAccount>50305000</GLAccount> <AmountInTransactionCurrency currencyCode="AED">' + finalAmount + '</AmountInTransactionCurrency> <DebitCreditCode>S</DebitCreditCode> <DocumentItemText>Item 1</DocumentItemText> <AccountAssignment> <!--Optional:--> <WBSElement>' + demandMdl.wbs_element_id + '</WBSElement> </AccountAssignment> </Item> <Item> <!--Optional:--> <ReferenceDocumentItem>2</ReferenceDocumentItem> <GLAccount>50305000</GLAccount> <AmountInTransactionCurrency currencyCode="AED">-' + finalAmount + '</AmountInTransactionCurrency> <DebitCreditCode>H</DebitCreditCode> <DocumentItemText>Item 2</DocumentItemText> <AccountAssignment> <CostCenter>' + demandMdl.cost_centre_id + '</CostCenter> </AccountAssignment> </Item> </JournalEntry> </JournalEntryCreateRequest> </sfin:JournalEntryBulkCreateRequest> </soap:Body> </soap:Envelope>';
                            let path = AppConstants.URL.gl_posting;
                           // let response = await this.restMethodPostBySOAP(path, payload);
                           let response = await this.restMethodGetWitSOAPData(path, payload);
                            let successMsg = demandMdl.id ? this.getResourceBundle("cob_updatedMsg") : that.getResourceBundle("cob_successMsg");

                            //if (response == 0) {
                            MessageBox.information(successMsg, {
                                actions: [MessageBox.Action.CLOSE],
                                onClose: function (sAction) {
                                    if (!demandMdl.id) {//Create
                                        that.getView().setModel(new JSONModel(), "demandMdl");
                                        that.getView().setModel(new JSONModel(), "addConfrimationMdl");
                                        that.getView().setModel(new JSONModel(), "costCenterRates");
                                    }
                                    if (demandMdl.id) {//Update
                                        that.getView().setModel(new JSONModel(), "demandMdl");
                                        that.getView().setModel(new JSONModel(), "addConfrimationMdl");
                                        that.getView().setModel(new JSONModel(), "costCenterRates");
                                        that.fetchEquipmentById(that._item);
                                    }
                                    if (that._oDialog) {
                                        that._oDialog.destroy();
                                        that._oDialog = null;
                                    }
                                }
                            });
                            that.getView().getModel("demandMdl").refresh();
                            //}
                        }else{
                            MessageToast.show("Posting amount should be greater than 0.");
                        }
                        this.showLoading(false);

                    } catch (error) {
                        this.showLoading(false);
                        this.errorHandling(error);
                    }
                }
            }
        );
    }
);
