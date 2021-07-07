export const isGreater = (param) => {
    if (param < 10) return "#00";
    if (param < 100) {
      return "#0";
    } else {
      return "#";
    }
  };