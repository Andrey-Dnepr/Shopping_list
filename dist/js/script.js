window.addEventListener('DOMContentLoaded', () => {
    const addForm = document.querySelector('.products__item__wrap'),
          body = document.querySelector('body'),
          menuWindow = document.querySelector('.menu__window'),
          refreshWindow = document.querySelector('.refresh__window'),
          shoppingWindow = document.querySelector('.list__window');

    let productsItems = [],
        addNewProductForm = [],
        totalCost = 0,
        userNickname = 'account_3'; //в эту переменную записываем данные о текущем пользователе, чтоб подтягтвать его список

    body.addEventListener('click', (event) => {
        event.preventDefault();
        switch (event.target.dataset.btn) {
            // case 'sigin' :


            //     break;
            case 'menu':
                //Вставит приветствие Hello "nickname"! What do we do?
                refreshWindow.classList.add('hide');
                shoppingWindow.classList.add('hide');
                menuWindow.classList.remove('hide');
                totalCost = 0;
                break; 
            case 'refresh-stocks':
                menuWindow.classList.toggle('hide');
                refreshWindow.classList.toggle('hide');
                openRefreshWindow();
                addNewProductForm = document.querySelector('.products__form'); 
                break;
            case 'shoping-list':
                menuWindow.classList.add('hide');    
                shoppingWindow.classList.toggle('hide');
                refreshWindow.classList.add('hide');
                addShoppingList();
                break;
            case 'add-product':
                if (!addNewProductForm.childNodes[0].value || addNewProductForm.childNodes[0].value === ' ') {
                    addNewProductForm.childNodes[0].placeholder = 'Enter a product name!';
                    addNewProductForm.childNodes[0].style.backgroundColor = 'rgb(109, 213, 239)';
                } else {
                    let newElement = addNewProduct(
                        addNewProductForm.childNodes[0].value,
                        addNewProductForm.childNodes[2].value,
                        addNewProductForm.childNodes[4].value,
                        addNewProductForm.childNodes[6].value,
                        addNewProductForm.childNodes[8].value
                    );
                    addForm.prepend(newElement);
                    //сделать отправку новых данных на сервер
                    addNewProductForm.reset(); //сбрасываем значение форм
                    addNewProductForm.childNodes[0].style.backgroundColor = 'white';
                    addNewProductForm.childNodes[0].placeholder = "The product's name";
                }
                break;
            case 'change-product':
                productsItems = document.querySelectorAll('.products__item');
                if (event.target.innerHTML === "Edit") {
                    event.target.innerHTML = "Cancel";
                    event.target.style.backgroundColor = 'rgb(244, 204, 43)';
                    productsItems.forEach(item => {
                        if (event.target.dataset.btnkey === item.dataset.obj) {
                            item.childNodes[7].classList.toggle('hide');
                            item.childNodes[9].classList.toggle('hide');
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
                            item.childNodes[9].childNodes[3].value = item.childNodes[9].childNodes[3].placeholder;
                            item.childNodes[9].childNodes[9].value = item.childNodes[9].childNodes[7].placeholder;
                            item.childNodes[9].childNodes[11].value = item.childNodes[9].childNodes[11].placeholder;
                            item.childNodes[9].classList.toggle('hide');
                            item.childNodes[7].classList.toggle('hide');
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
                        item.childNodes[9].childNodes[3].placeholder = item.childNodes[9].childNodes[3].value;
                        item.childNodes[9].childNodes[7].placeholder = item.childNodes[9].childNodes[7].value;
                        item.childNodes[9].childNodes[11].placeholder = item.childNodes[9].childNodes[11].value;
                        item.childNodes[5].innerHTML = "Edit";
                        item.childNodes[5].style.backgroundColor = 'rgb(81, 167, 242)';
                        item.childNodes[7].classList.toggle('hide'); //под 7 номером у родителя находится елемент с тегом .btn__wrap
                        item.childNodes[9].classList.toggle('hide');
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
            case 'del-from-list':
                productsItems.forEach(item => {
                    if (event.target.dataset.btnkey === item.dataset.obj) {
                        totalCost -= item.childNodes[9].childNodes[19].value;
                        totalCost = totalCost.toFixed(2);
                        shoppingWindow.childNodes[2].childNodes[1].value = totalCost;
                        item.remove();
                    }
                });
                break;
            case 'show':
                productsItems = document.querySelectorAll('.products__item');
                productsItems.forEach(item => {
                    if (event.target.dataset.btnkey === item.dataset.obj) {
                        item.childNodes[7].classList.toggle('hide');
                        item.childNodes[9].classList.toggle('hide');
                        item.childNodes[3].classList.toggle('btn_inset');
                        item.childNodes[9].childNodes[11].disabled = false;
                        item.childNodes[9].childNodes[11].style.backgroundColor = '#74d4ec';
                        item.childNodes[9].childNodes[11].addEventListener('change', () => {
                            item.childNodes[9].childNodes[19].value = item.childNodes[9].childNodes[11].value * item.childNodes[9].childNodes[15].value;
                            item.childNodes[9].childNodes[11].placeholder = item.childNodes[9].childNodes[11].value;
                            item.childNodes[3].textContent = item.childNodes[9].childNodes[11].value; 
                        });
                    }
                });    
                break;
            case 'hide':
                totalCost = 0;
                productsItems.forEach(item => {
                    if (event.target.dataset.btnkey === item.dataset.obj) {
                        item.childNodes[7].classList.toggle('hide');
                        item.childNodes[9].classList.toggle('hide');
                        item.childNodes[3].classList.toggle('btn_inset');
                    }
                    totalCost += item.dataset.price * item.childNodes[9].childNodes[11].placeholder
                });
                totalCost = totalCost.toFixed(2);
                shoppingWindow.childNodes[2].childNodes[1].value = totalCost;
                break;    
            case 'ok':
                productsItems = document.querySelectorAll('.products__item');
                if (event.target.innerHTML === '\u2714') {
                    totalCost = 0;
                    event.target.innerHTML = "Back";
                    event.target.style.backgroundColor = 'rgb(24, 100, 223)';
                    productsItems.forEach(item => {
                        if (event.target.dataset.btnkey === item.dataset.obj) {
                            item.childNodes[7].classList.add('hide');
                            item.childNodes[9].classList.add('hide');
                            item.childNodes[3].classList.remove('btn_inset');
                            item.childNodes[1].style.backgroundColor = 'gray';
                            item.childNodes[3].style.backgroundColor = 'gray';
                            item.style.backgroundColor = 'gray';
                            item.childNodes[3].dataset.btn = 'none';
                            item.childNodes[1].style.textDecoration = 'line-through';
                            shoppingWindow.childNodes[1].append(item);
                        }
                        totalCost += item.dataset.price * item.childNodes[9].childNodes[11].placeholder
                    });
                    totalCost = totalCost.toFixed(2);
                    shoppingWindow.childNodes[2].childNodes[1].value = totalCost;    
                } else {
                    event.target.innerHTML = "&#10004;";
                    event.target.style.backgroundColor = 'rgb(107, 208, 109)';
                    productsItems.forEach(item => {
                        if (event.target.dataset.btnkey === item.dataset.obj) {
                            item.childNodes[1].style.backgroundColor = 'white';
                            item.childNodes[3].style.backgroundColor = 'white';
                            item.style.backgroundColor = 'white';
                            item.childNodes[3].dataset.btn = 'show';
                            item.childNodes[1].style.textDecoration = 'none';
                            shoppingWindow.childNodes[1].prepend(item);
                        }
                    }); 
                }
                break;
        }
    });

    function addShoppingList() {
        shoppingWindow.childNodes[1].innerHTML = '';
        const request = new XMLHttpRequest();
        request.open('GET', 'js/data.json');
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.send();
        request.addEventListener('load', () => {
            if (request.status === 200) {
                const data = JSON.parse(request.response);    
                for (let key in data[userNickname]['stuff']) {
                    if (Math.round(data[userNickname]['stuff'][key].stock-data[userNickname]['stuff'][key].quantity) !== 0) {
                        let newElement = addItemList(
                            data[userNickname]['stuff'][key].name, 
                            data[userNickname]['stuff'][key].quantity, 
                            data[userNickname]['stuff'][key].price, 
                            data[userNickname]['stuff'][key].group, 
                            data[userNickname]['stuff'][key].stock);
                        if (data[userNickname]['stuff'][key].group === 10) {
                            newElement.style.backgroundColor = 'rgb(177, 235, 135)';
                            newElement.childNodes[1].style.backgroundColor = 'rgb(177, 235, 135)';
                        }
                        shoppingWindow.childNodes[1].append(newElement);
                        totalCost += data[userNickname]['stuff'][key].price * Math.round(data[userNickname]['stuff'][key].stock-data[userNickname]['stuff'][key].quantity);
                    }
                };
                totalCost = totalCost.toFixed(2);
                shoppingWindow.childNodes[2].childNodes[1].value = totalCost;
                productsItems = document.querySelectorAll('.products__item');
                productsItems.forEach(item => {
                    if (item.dataset.group === '10') {
                        shoppingWindow.childNodes[1].append(item);
                    }
                });

            } else {
            //Вставить сообщение об ошибке
            }
        });
        
    }

    function addItemList(name, quantity, price, group, stock) {
        const newProduct = document.createElement('div');
        newProduct.classList.add('products__item');
        newProduct.dataset.name = name;
        newProduct.dataset.obj = name;
        newProduct.dataset.group = group;
        newProduct.dataset.price = price;
        newProduct.dataset.buy = stock-quantity;
        newProduct.innerHTML = `
            <input required disabled placeholder="${name}" value="${name}" name="product-name" type="text" class="input input_new-product input_product">
            <button data-btnkey="${name}" data-btn="show" class="btn btn_change-product btn_show">${Math.round(stock-quantity)}</button>
            <button data-btnkey="${name}" data-btn="ok" class="btn btn_change-product bg-green">&#10004;</button>
            <div class="input_divider hide"></div>
            <div data-wrap="${name}" class="btn__wrap hide">
                <div class="products__stock">Current Stock</div>
                <input required disabled placeholder="${quantity}" value="${quantity}" type="number" class="input input_stock w_40">
                <div class="products__price">Stock</div>
                <input required disabled placeholder="${stock}" value="${stock}" type="number" class="input input_stock w_40">
                <div class="products__price">Buy</div>
                <input required disabled placeholder="${Math.round(stock-quantity)}" value="${Math.round(stock-quantity)}" type="number" class="input input_stock w_40">
                <div class="products__price">Price</div>
                <input required disabled placeholder="${price}" value="${price}" type="number" class="input input_stock w_75">
                <div class="products__price">Cost</div>
                <input required disabled placeholder="${Math.round(stock-quantity)*price}" value="${Math.round(stock-quantity)*price}" type="number" class="input input_stock w_75">
                <button data-btnkey="${name}" data-btn="hide" class="btn btn_refresh-product">Hide</button>
                <button data-btnkey="${name}" data-btn="del-from-list" class="btn btn_delete-product">Del</button>
            </div>
        `;
        return newProduct;
    }

    function openRefreshWindow() {
        addForm.innerHTML = '';
        const request = new XMLHttpRequest();
        request.open('GET', 'js/data.json');
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.send();
        request.addEventListener('load', () => {
            if (request.status === 200) {
                const data = JSON.parse(request.response);    
                for (let key in data[userNickname]['stuff']) {
                    let newElement = addNewProduct(
                        data[userNickname]['stuff'][key].name, 
                        data[userNickname]['stuff'][key].quantity, 
                        data[userNickname]['stuff'][key].price, 
                        data[userNickname]['stuff'][key].group, 
                        data[userNickname]['stuff'][key].stock);
                    addForm.append(newElement);
                };    
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
            <div class="input_divider hide"></div>
            <div data-wrap="${name}" class="btn__wrap hide">
                <div class="products__price">Price</div>
                <input required placeholder="${price}" value="${price}" name="product-price" type="text" class="input input_price">
                <div class="products__group">Product group</div>
                <input required placeholder="${group}" value="${group}" name="product-group" type="text" class="input input_group">
                <div class="products__stock">Min stock</div>
                <input required placeholder="${stock}" value="${stock}" name="product-stock" type="text" class="input input_stock">
                <button data-btnkey="${name}" data-btn="save-product" class="btn btn_refresh-product">Save</button>
                <button data-btnkey="${name}" data-btn="del-product" class="btn btn_delete-product">Del</button>
            </div>
        `;
        return newProduct;
    }

    

});