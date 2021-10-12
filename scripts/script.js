
document.addEventListener('DOMContentLoaded',()=>{
    // строгое соответствие при use strict
    'use strict';
    // работа с сервером
    // функция getData делает запрос на сервер и получает данные в 4 стадии(request.readyState==4) в формате JSON (при отсутствии ошибок request.status===200) и парсит их в hnml
    const getData=(url,callback)=>{
        const request= new XMLHttpRequest();
        request.open("GET",url);
        request.send();

        request.addEventListener('readystatechange',()=>{
            if (request.readyState!==4)return;
            if(request.status===200){
                const response= JSON.parse(request.response);
                callback(response);
            }else{
                console.error( new Error('Ошибка:'+request.status));
            }
        });
    };
   


    const tabs=()=>{
        const cardDetailChangeElems=document.querySelectorAll(".card-detail__change");
        const cardDetailsTitleElem=document.querySelector(".card-details__title");
        const cardImageItemElem=document.querySelector(".card__image_item");
        const cardDetailsPriceElem=document.querySelector(".card-details__price");
        const descriptionMemory=document.querySelector('.description__memory')
        const data=[
            {name:'Смартфон Apple iPhone 12 Pro 128GB Graphite',
            img:'img/iPhone-graphite.png',
            price:95990,
            memoryROM:128},
            {name:'Смартфон Apple iPhone 12 Pro 256GB Silver',
            img:'img/iPhone-silver.png',
            price:120990,
            memoryROM:256},
            {name:'Смартфон Apple iPhone 12 Pro 128GB Pacific Blue',
            img:'img/iPhone-blue.png',
            price:99990,
            memoryROM:128}
        ];
// делает невидимыми все элементы 
        const deactivate=()=>{
        cardDetailChangeElems.forEach(btn=> btn.classList.remove('active'))
        }
// проявляет на экран элемент,соответствующий выбору кликом 
        cardDetailChangeElems.forEach((btn,i)=>{
            btn.addEventListener('click',()=>{
                if (!btn.classList.contains('active')){
                    deactivate();
                    btn.classList.add('active');
                    cardDetailsTitleElem.textContent=data[i].name;
                    cardImageItemElem.src=data[i].img;
                    cardImageItemElem.alt=data[i].img;
                    cardDetailsPriceElem.textContent=data[i].price +'₽';
                    descriptionMemory.textContent=`Встроенная память (ROM) ${data[i].memoryROM} ГБ`
                }
            });
        });
    };
    // const accordion=()=>{
    //     const characteristicsTitle=document.querySelectorAll('.characteristics__title');
    //     const characteristicsDescription=document.querySelectorAll('.characteristics__description');
        
    //     characteristicsTitle.forEach((elem,i)=>{
    //         elem.addEventListener('click',()=>{
    //             elem.classList.toggle('active');
    //             characteristicsDescription[i].classList.toggle('active');
    //         });
    //     });
    // };
    const accordion=()=>{
        const characteristicsListElem=document.querySelector('.characteristics__list');
        const characteristicsItemElems=document.querySelectorAll('.characteristics__item');
// возвращает элементу аккордеона- выпадающему окну- высоту,если оно имеет класс active(по нему кликнули) 
        characteristicsItemElems.forEach(elem=>{
            if(elem.children[1].classList.contains('active')){
                elem.children[1].style.height=`${elem.children[1].scrollHeight}px`;
            }
        })
// открывает элемент аккордеона, по которому кликнули-остальные все закрывает
        const open=(button,dropDown)=>{
            closeAllDrops(button,dropDown);
            dropDown.style.height=`${dropDown.scrollHeight}px`;
            button.classList.add('active');
            dropDown.classList.add('active');
        };
// закрывает элемент аккордеона, по которому кликнули
        const close=(button,dropDown)=>{
            button.classList.remove('active');
            dropDown.classList.remove('active');
            dropDown.style.height='';
        };
// закрывает все элементы аккордеона
        const closeAllDrops=(button,dropDown)=>{
            characteristicsItemElems.forEach((elem)=>{
                if(elem.children[0]!==button&& elem.children[1]!==dropDown){
                    close(elem.children[0],elem.children[1]);
                }
            });
        };
// Слушает клики по всему списку характеристик и проверяет,был ли это клик по элементу списка-заголовку списка, если да -определяет его ближайший старший элемент-открывает элемент списка,если он закрыт, иначе-закрывает.
        characteristicsListElem.addEventListener('click',(event)=>{
            const target=event.target;
            if(target.classList.contains('characteristics__title')){
                const parent=target.closest('.characteristics__item');
                const description=parent.querySelector('.characteristics__description');
                description.classList.contains('active')? 
                    close(target,description):
                        open(target,description);
            }
        });
        // если кликаем мимо аккордеона(просто по телу)-закрываются все его вкладки
        document.body.addEventListener('click',(event)=>{
            const target=event.target;
            if(!target.closest('.characteristics__list')){
                closeAllDrops();
            }
        })
    };
    
    
    
// вызываем модальное окно при клике на кнопку 'купить' красную , а при клике на его крестик  или мимо модального окна-закрываем его
    const modal=()=>{
        const cardDetailsButtonBuy=document.querySelector('.card-details__button_buy');
        const modal=document.querySelector('.modal');
        const cardDetailsButtonDelivery=document.querySelector('.card-details__button_delivery');
        const cardDetailsTitle=document.querySelector('.card-details__title');
        const modalTitle=modal.querySelector('.modal__title');
        const modalSubtitle=modal.querySelector('.modal__subtitle');
// открытие модального 
        const openModal=event=>{
            const target=event.target;
            modal.classList.add('open');
            document.addEventListener('keydown',escapeHandler);
            // вставляет в модальное окно название нужной выбранной модели
            modalTitle.textContent=cardDetailsTitle.textContent;
             // вставляет в модальное окно название 'оплата' лили 'доставка и оплата' в зависимости от нажатой кнопки 
            modalSubtitle.textContent=target.dataset.buttonBuy;
        };
// закрытие модального       
        const closeModal=()=>{
            modal.classList.remove('open');
            document.removeEventListener('keydown',escapeHandler);
    };
            
// закрытие модального окна по Esc   
        const escapeHandler=event=>{
            if (event.code==="Escape"){
                closeModal();
            };
        };
// закрытие модального окна по значку крестик или по клику за пределами модального окна
        modal.addEventListener('click',event=>{
            const target=event.target;
            if (target.classList.contains('modal__close')||target===modal){
                closeModal();
            }
        });
// прослушивание кликов по кнопке 'купить' красной,и в случае клика по ней- открытие модального окна
        cardDetailsButtonBuy.addEventListener('click',openModal);
        cardDetailsButtonDelivery.addEventListener('click',openModal);
    };
                
            
// закрываем модалку по Esc

// const escapeHandler=event=>{
//             // console.log(event);
//             if(event.code==="Escape"){
//                 modal.classList.remove('open');  
//             };
//         };
//     } 
    const renderCrossSell=()=>{
        const crossSellList=document.querySelector('.cross-sell__list');
        const crossSellAdd=document.querySelector('.cross-sell__add');
        const allGoods=[];
        const shuffle=arr=>arr.sort(()=>Math.random()-0.5);


        const createCrossSellItem=({photo, name, price})=>{
            // пример -деструктуризация объекта
            // const {photo:picture, name, price}=good;

            const liItem=document.createElement('li');
            liItem.innerHTML=
                    `<article class="cross-sell__item">

							<img class="cross-sell__image" src=${photo} alt='${name}'>

							<h3 class="cross-sell__title">${name}</h3>
							<p class="cross-sell__price">${price}₽</p>
							<button type='button' class="button button_buy cross-sell__button">Купить</button>
					</article>
                        `;
                        return liItem;
        }

        const render=arr=>{
        arr.forEach(item=>{
                        crossSellList.append(createCrossSellItem(item));
                    })
        }
        const wrapper=(fn,count)=>{
            let counter=0;
            return(...args)=>{
                if (counter===count) return;                
                counter++;
                return fn(...args);
            }
        };
        
        const wrapRender=wrapper(render,2);

        const createCrossSellList=(goods=[])=>{
            allGoods.push(...shuffle(goods))
            console.log(allGoods)
            // crossSellList.textContent="";
            // const shuffleGoods=shuffle(alGgoods);
            const fourItems=allGoods.splice(0,4);
            wrapRender(fourItems);
            
            
        }
        crossSellAdd.addEventListener('click',()=>{
            wrapRender(allGoods);
        })


        getData('cross-sell-dbase/dbase.json',createCrossSellList);
    }


    tabs();
    accordion();
    modal();
    renderCrossSell();
    amenu('.header__menu','.header-menu__list','.header-menu__item','.header-menu__burger');
})