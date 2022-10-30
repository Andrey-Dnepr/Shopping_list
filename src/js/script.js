window.addEventListener('DOMContentLoaded', () => {
    const addForm = document.querySelector('.products__form');
    const request = new XMLHttpRequest();

    request.open('GET', 'js/data.json');
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.send();

    request.addEventListener('load', () => {
        if (request.status === 200) {
            const data = JSON.parse(request.response);
            const newItem = document.createElement('div');
            newItem.classList.add('products__item__wrap');
            console.log(data);
            for (let key in data) {
                newItem.innerHTML += `
                <div data-obj="${key}" data-name="${data[key].name}" class="products__item">
                    <input required disabled placeholder="${data[key].name}" name="product-name" type="text" class="input input_new-product input_product">
                    <input required disabled placeholder="${data[key].quantity}" name="product-quantity" type="text" class="input input_new-quantity input_quantity">
                    <button class="btn btn_change-product">Change</button>
                    <div class="btn__wrap hide">
                        <div class="products__price">Price for 1 unit</div>
                        <input required placeholder="${data[key].price}" name="product-price" type="text" class="input input_price">
                        <div class="products__group">Product group</div>
                        <input required placeholder="${data[key].group}" name="product-group" type="text" class="input input_group">
                        <div class="products__stock">Stock</div>
                        <input required placeholder="${data[key].stock}" name="product-stock" type="text" class="input input_stock">
                        <button class="btn btn_refresh-product">Save</button>
                        <button class="btn btn_cancel">Cancel</button>
                        <button class="btn btn_delete-product">Del</button>
                    </div>
                </div>
            `
            };

            addForm.insertAdjacentElement('afterend', newItem);
        } else {
        
        }
    });

});