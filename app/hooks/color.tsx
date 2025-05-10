import  colors  from "../constants/colors";

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "selesai":
      return colors.selesai;
    case "pencucian":
      return colors.pencucian;
    case "penjemputan":
      return colors.penjemputan;
    case "pengantaran":
      return colors.primary;
    case "batal":
      return colors.batal;
    case "pending":
      return colors.pending;
    default:
      return colors.kesalahan;
  }
};

const getTextColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "pending":
      return colors.white;
    case "kesalahan":
      return colors.black;
    default:
      return colors.white;
  }
};

export default {
  getStatusColor,
  getTextColor
};