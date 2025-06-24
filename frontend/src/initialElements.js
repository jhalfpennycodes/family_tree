import rockerfellers from "./rockefellerFamily.json";

//Map the json data to the create the nodes with corresponding data
const newNodes = rockerfellers.map((rockerfeller) => ({
  id: rockerfeller.id,
  type: "avatar",
  data: {
    imgUrl: rockerfeller.imgUrl,
    name: rockerfeller.name,
    dob: rockerfeller.dob,
    father: rockerfeller.parents[0],
    mother: rockerfeller.parents[1],
    lifeDescription: rockerfeller.lifeDescription,
  },
}));

export const initialEdges = [
  { id: "1->3", source: "1", target: "3" },
  { id: "2->3", source: "2", target: "3" },
  { id: "1->4", source: "1", target: "4" },
  { id: "2->4", source: "2", target: "4" },
  { id: "1->5", source: "1", target: "5" },
  { id: "2->5", source: "2", target: "5" },
  { id: "1->6", source: "1", target: "6" },
  { id: "2->6", source: "2", target: "6" },
  { id: "1->7", source: "1", target: "7" },
  { id: "2->7", source: "2", target: "7" },
  { id: "7->10", source: "7", target: "10" },
  { id: "8->10", source: "8", target: "10" },
  { id: "7->11", source: "7", target: "11" },
  { id: "8->11", source: "8", target: "11" },
  { id: "7->12", source: "7", target: "12" },
  { id: "8->12", source: "8", target: "12" },
  { id: "7->13", source: "7", target: "13" },
  { id: "8->13", source: "8", target: "13" },
  { id: "7->14", source: "7", target: "14" },
  { id: "8->14", source: "8", target: "14" },
  { id: "7->15", source: "7", target: "15" },
  { id: "8->15", source: "8", target: "15" },
];

export { newNodes };
