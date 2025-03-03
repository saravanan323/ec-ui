sap.ui.define([], function () {
	"use strict";
	return {
		isNavigated: function (sNavigatedItemId, sItemId) {
			return sNavigatedItemId == sItemId;
		},
		showHideFullScreen: function (val1, val2) {
			return val1 != null && val2 != null ? true : false;
		},
		convertSAPDate(sapDate) {
			if (!sapDate || typeof sapDate !== "string") {
				console.error("Invalid input: Expected a string in SAP date format.");
				return null; // Return null or a default date as needed
			}
			const timestamp = Number(sapDate.match(/\d+/)[0]); // Extract and convert timestamp
			const date = new Date(timestamp);

			// Extract day, month, and year using template literals
			const [day, month, year] = [
				date.getDate().toString().padStart(2, "0"),
				(date.getMonth() + 1).toString().padStart(2, "0"),
				date.getFullYear(),
			];

			return `${day}-${month}-${year}`;
		},
		getUtcDate: function (val) {
			if (val) {
				let dateString = val.substr(6);

				let d = new Date(parseInt(dateString)),
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
		getStatusText: function (val) {
			if (val == 1) {
				return "Created";
			} else if (val == 2) {
				return "Released";
			} else {
				return "Closed";
			}
		},
		getPaymentStatusText: function (val) {
			if (val == 1) {
				return "Released";
			} else if (val == 2) {
				return "Not Released";
			}
		},

		statusFormatterState: function (getValue) {
			let setValue = "None";
			switch (getValue) {
				case 1:
					setValue = "Success";
					break;
				case 2:
					setValue = "Warning";

					break;
				case 3:
					setValue = "Error";
					break;
				case 4:
					setValue = "Information";
					break;

				default:
					setValue = "None";
					break;
			}
			return setValue;
		},

		statusFormatterText: function (getValue) {
			let setValue = "None";
			switch (getValue) {
				case 1:
					setValue = "Approved";
					break;
				case 2:
					setValue = "In Approval";

					break;
				case 3:
					setValue = "Rejected";
					break;
				case 4:
					setValue = "In Revision";
					break;

				default:
					setValue = "None";
					break;
			}
			return setValue;
		},

		statusFormatterIcon: function (getValue) {
			let setValue = "";
			switch (getValue) {
				case 1:
					setValue = "sap-icon://sys-enter-2";
					break;
				case 2:
					setValue = "sap-icon://alert";

					break;
				case 3:
					setValue = "sap-icon://error";
					break;
				case 4:
					setValue = "sap-icon://information";
					break;

				default:
					setValue = "";
					break;
			}
			return setValue;
		},

		getPaymentStatus: function (val) {
			if (val == 1) {
				return "Success";
			} else if (val == 2) {
				return "Error";
			}
		},
		statusText(value) {
			if (value) {
				return value == 1 ? "Approved" : value == 2 ? "Pending" : "";
			}
		},

		statusState(value) {
			if (value) {
				return value == 1 ? "Success" : value == 2 ? "Error" : "None";
			}
		},
		sectionTitleFormatter(value, list) {
			if (value && list) {
				return list?.find(e => value == e.PurchasingGroup)?.PurchasingGroupName;
			}
		},
		purchasingProcessingStatusFormatter(value, list) {
			if (value && list) {
				return list?.find(e => value == e.key)?.text;
			}
		},
	};
});
