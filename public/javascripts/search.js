
// const handlesearch = async () => {
//     const posts = await postModel.find().populate("userid");

//     const input = document.querySelector('#searchbx');
//     input.addEventListener("focus",() => {
//         const main = document.querySelector('#main');
//         main.style.display = "none";
//     })

//     input.addEventListener("blur",() => {
//         const main = document.querySelector('#main');
//         main.style.display = "block";
//     })

//     input.addEventListener("input", () => {
//         const filteredArray = posts.filter(obj => obj.title.startsWith(input.value));
//         console.log(filteredArray);
//         console.log(input.value);
//     })
// }

// handlesearch();