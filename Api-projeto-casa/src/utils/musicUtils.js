let filterById = (model, id) => {
    let filteredData = model.find((music) => {
        return music.id == id
    });
    return filteredData;
};


module.exports = {
    filterById
};