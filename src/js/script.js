window.addEventListener('DOMContentLoaded', () => {
    const addForm = document.querySelector('.products__form'),
          body = document.querySelector('body'),
          headerTitle = document.querySelector('header'),
          menuWindow = document.querySelector('.menu__window'),
          refreshWindow = document.querySelector('.refresh__window'),
          shoppingWindow = document.querySelector('.list__window');

    let productsItems = [],
        addNewProductForm = [];

    body.addEventListener('click', (event) => {
        event.preventDefault();
        switch (event.target.dataset.btn) {
            case 'refresh-stocks': 
                openRefreshWindow();
                addNewProductForm = document.querySelector('.products__form'); 
                break;
            case 'shoping-list':
                //Вставит приветствие Hello "nickname"! What do we do?
                headerTitle.classList.add('hide');
                menuWindow.classList.add('hide');    
                shoppingWindow.classList.toggle('hide');
                refreshWindow.classList.add('hide');         
                break;
            case 'add-product':
                if (!addNewProductForm.childNodes[0].value || addNewProductForm.childNodes[0].value === ' ') {
                    addNewProductForm.childNodes[0].placeholder = 'Введите название продукта';
                } else {
                    addForm.insertAdjacentElement('afterend', addNewProduct(
                        addNewProductForm.childNodes[0].value,
                        addNewProductForm.childNodes[2].value,
                        addNewProductForm.childNodes[4].value,
                        addNewProductForm.childNodes[6].value,
                        addNewProductForm.childNodes[8].value
                    ));
                    //сделать отправку новых данных на сервер
                    addNewProductForm.childNodes[0].value = '';
                    addNewProductForm.childNodes[2].value = '';
                    addNewProductForm.childNodes[4].value = '';
                    addNewProductForm.childNodes[6].value = '';
                    addNewProductForm.childNodes[8].value = '';
                }
                break;
            case 'change-product':
                productsItems = document.querySelectorAll('.products__item');
                if (event.target.innerHTML === "Edit") {
                    event.target.innerHTML = "Cancel";
                    event.target.style.backgroundColor = 'rgb(244, 204, 43)';
                    productsItems.forEach(item => {
                        if (event.target.dataset.btnkey === item.dataset.obj) {
                            item.childNodes[7].classList.toggle('hide'); //под 7 номером у родителя находится елемент с тегом .btn__wrap
                            item.childNodes[1].disabled = false;
                            item.childNodes[3].disabled = false;
                        }
                    });    
                } else {
                    event.target.innerHTML = "Edit";
                    event.target.style.backgroundColor = 'rgb(81, 167, 242)';
                    productsItems.forEach(item => {
                        if (event.target.dataset.btnkey === item.dataset.obj) {
                            item.childNodes[1].value = item.childNodes[1].placeholder;
                            item.childNodes[3].value = item.childNodes[3].placeholder;
                            item.childNodes[7].childNodes[3].value = item.childNodes[7].childNodes[3].placeholder;
                            item.childNodes[7].childNodes[7].value = item.childNodes[7].childNodes[7].placeholder;
                            item.childNodes[7].childNodes[11].value = item.childNodes[7].childNodes[11].placeholder;
                            item.childNodes[7].classList.toggle('hide'); //под 7 номером у родителя находится елемент с тегом .btn__wrap
                            item.childNodes[1].disabled = true;
                            item.childNodes[3].disabled = true;
                        }
                    });
                }
                break;
            case 'save-product':
                productsItems.forEach(item => {
                    if (event.target.dataset.btnkey === item.dataset.obj) {
                        item.childNodes[1].placeholder = item.childNodes[1].value;
                        item.childNodes[3].placeholder = item.childNodes[3].value;
                        item.childNodes[7].childNodes[3].placeholder = item.childNodes[7].childNodes[3].value;
                        item.childNodes[7].childNodes[7].placeholder = item.childNodes[7].childNodes[7].value;
                        item.childNodes[7].childNodes[11].placeholder = item.childNodes[7].childNodes[11].value;
                        item.childNodes[5].innerHTML = "Edit";
                        item.childNodes[5].style.backgroundColor = 'rgb(81, 167, 242)';
                        item.childNodes[7].classList.toggle('hide'); //под 7 номером у родителя находится елемент с тегом .btn__wrap
                        item.childNodes[1].disabled = true;
                        item.childNodes[3].disabled = true;
                        //Сделать отправку ПОСТ запроса на сервер с обновленными данными
                    }
                });
                break;
            case 'del-product':
                productsItems.forEach(item => {
                    if (event.target.dataset.btnkey === item.dataset.obj) {
                        //вставить отправку данных на сервер об удалении элемента из списка
                        item.remove();
                    }
                });
                break;    
        }
    });

    function openRefreshWindow() {
        headerTitle.classList.toggle('hide');
        menuWindow.classList.toggle('hide');
        refreshWindow.classList.toggle('hide');
        const request = new XMLHttpRequest();
        request.open('GET', 'js/data.json');
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.send();
        request.addEventListener('load', () => {
            if (request.status === 200) {
                const data = JSON.parse(request.response);    
                for (let key in data) {
                    addForm.insertAdjacentElement('afterend', addNewProduct(
                        data[key].name, 
                        data[key].quantity, 
                        data[key].price, 
                        data[key].group, 
                        data[key].stock));    
                }
            } else {
            //Вставить сообщение об ошибке
            }
        });    
    }

    function addNewProduct(name, quantity, price, group, stock) {
        if (quantity === '') {quantity = 0};
        if (price === '') {price = 0};
        if (group === '') {group = 1};
        if (stock === '') {stock = 0};
        const newProduct = document.createElement('div');
        newProduct.classList.add('products__item');
        newProduct.dataset.obj = name;
        newProduct.dataset.name = name;
        newProduct.innerHTML = `
            <input required disabled placeholder="${name}" value="${name}" name="product-name" type="text" class="input input_new-product input_product">
            <input required disabled placeholder="${quantity}" value="${quantity}" name="product-quantity" type="text" class="input input_new-quantity input_quantity">
            <button data-btnkey="${name}" data-btn="change-product" class="btn btn_change-product">Edit</button>
            <div data-wrap="${name}" class="btn__wrap hide">
                <div class="products__price">Price for 1 unit</div>
                <input required placeholder="${price}" value="${price}" name="product-price" type="text" class="input input_price">
                <div class="products__group">Product group</div>
                <input required placeholder="${group}" value="${group}" name="product-group" type="text" class="input input_group">
                <div class="products__stock">Stock</div>
                <input required placeholder="${stock}" value="${stock}" name="product-stock" type="text" class="input input_stock">
                <button data-btnkey="${name}" data-btn="save-product" class="btn btn_refresh-product">Save</button>
                <button data-btnkey="${name}" data-btn="del-product" class="btn btn_delete-product">Del</button>
            </div>
        `;
        return newProduct;
    }

    

});