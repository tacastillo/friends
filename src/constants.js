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

export const stopwords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', 'couldn', 'didn', 'doesn', 'hadn', 'hasn', 'haven', 'isn', 'ma', 'mightn', 'mustn', 'needn', 'shan', 'shouldn', 'wasn', 'weren', 'won', 'wouldn', 'yeah', 'okay', 'gon', 'na', 'gonna', 'oh', 'hey', 'well', 'im', 'right', 'like', 'its', "know"];