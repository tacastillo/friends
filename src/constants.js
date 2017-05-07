import { scaleOrdinal } from "d3-scale";

export const red = "#C31D20";
export const blue = "#3ED1FC";
export const yellow = "#F3D060";

export function toTitleCase(word) {
	return (word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

export function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

export function toComma(value) {
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const NAMES = ["RACHEL", "ROSS", "MONICA", "CHANDLER", "JOEY", "PHOEBE"];

export const color = scaleOrdinal(['#1b9e77','#d95f02','#7570b3','#e7298a','#4286f4','#e6ab02'])
	.domain(NAMES);