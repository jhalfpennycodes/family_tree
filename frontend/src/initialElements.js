// export const initialEdges = [
//   { id: "c-joe", source: "1", target: "3" }, // Christine -> Joe
//   { id: "d-joe", source: "2", target: "3" }, // Deane -> Joe
//   { id: "c-lucas", source: "1", target: "4" }, // Christine -> Lucas
//   { id: "d-lucas", source: "2", target: "4" }, // Deane -> Lucas
//   { id: "d-sam", source: "2", target: "5" }, // Deane -> Lucas
//   { id: "d-lucas", source: "1", target: "5" }, // Deane -> Lucas
//   { id: "g-christine", source: "6", target: "1" },
//   { id: "m-christine", source: "7", target: "1" },
//   { id: "judy-deane", source: "8", target: "2" },
//   { id: "giner-deane", source: "9", target: "2" },
// ];

// export const initialNodes = [
//   { id: "1", type: "avatar", data: { label: "Christine" } },
//   { id: "2", type: "avatar", data: { label: "Deane" } },
//   { id: "3", type: "avatar", data: { label: "Joe" } },
//   { id: "4", type: "avatar", data: { label: "Lucas" } },
//   { id: "5", type: "avatar", data: { label: "Sam" } },
//   { id: "6", type: "avatar", data: { label: "Gilbert" } },
//   { id: "7", type: "avatar", data: { label: "Mamie" } },
//   { id: "8", type: "avatar", data: { label: "Judy" } },
//   { id: "9", type: "avatar", data: { label: "Ginger" } },
// ];

// export const initialNodes = [
//   { id: "1", type: "avatar", data: { label: "William Jones" } },
//   { id: "2", type: "avatar", data: { label: "Anna Jones" } },
//   { id: "3", type: "avatar", data: { label: "Mike Stone" } },
//   { id: "4", type: "avatar", data: { label: "Karen Stone" } },
//   { id: "5", type: "avatar", data: { label: "Peter Jones" } },
//   { id: "6", type: "avatar", data: { label: "Susan Jones" } },
//   { id: "7", type: "avatar", data: { label: "Laura Stone" } },
//   { id: "8", type: "avatar", data: { label: "Lisa Stone" } },
//   { id: "9", type: "avatar", data: { label: "Daniel Stone" } },
//   { id: "10", type: "avatar", data: { label: "Adam Jones" } },
//   { id: "11", type: "avatar", data: { label: "Amy Jones" } },
//   { id: "12", type: "avatar", data: { label: "Poppy Jones" } },
//   { id: "13", type: "avatar", data: { label: "Duke Jones" } },
//   { id: "14", type: "avatar", data: { label: "Joan Jones" } },
//   { id: "15", type: "avatar", data: { label: "Joan Jones" } },
//   { id: "16", type: "avatar", data: { label: "JJ Seewa" } },
// ];

// export const initialEdges = [
//   { id: "13->1", source: "13", target: "1" }, // Christine -> Joe
//   { id: "12->1", source: "12", target: "1" }, // Christine -> Joe
// ];
import rockerfellers from "./rockefellerFamily.json";

//Map the json data to the create the nodes with corresponding data
console.log(rockerfellers);
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

console.log("NEW NODES:", newNodes);

export const initialNodes = [
  { id: "1", type: "avatar", data: { label: "John D. Rockefeller Sr." } },
  { id: "2", type: "avatar", data: { label: "Laura Celestia Spelman" } },
  { id: "3", type: "avatar", data: { label: "Bessie Rockefeller" } },
  { id: "4", type: "avatar", data: { label: "Alice Rockefeller" } },
  { id: "5", type: "avatar", data: { label: "Alta Rockefeller" } },
  { id: "6", type: "avatar", data: { label: "Edith Rockefeller" } },
  { id: "7", type: "avatar", data: { label: "John D. Rockefeller Jr." } },
  { id: "8", type: "avatar", data: { label: "Abby Aldrich Rockefeller" } },
  { id: "9", type: "avatar", data: { label: "Martha Baird Rockefeller" } },
  { id: "10", type: "avatar", data: { label: "Abby Rockefeller" } },
  { id: "11", type: "avatar", data: { label: "John D. Rockefeller III" } },
  { id: "12", type: "avatar", data: { label: "Nelson A. Rockefeller" } },
  { id: "13", type: "avatar", data: { label: "Laurance S. Rockefeller" } },
  { id: "14", type: "avatar", data: { label: "Winthrop Rockefeller" } },
  { id: "15", type: "avatar", data: { label: "David Rockefeller" } },
];

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
