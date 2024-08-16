 


$(function() {
	
	$('.select2').select2({
		placeholder: 'Choose one',
		searchInputPlaceholder: 'Search',
		minimumResultsForSearch: Infinity,
		width: '100%'
	});

	$('.select2-with-search').select2({
		searchInputPlaceholder: 'Search',
		width: '100%',
        dropdownParent: $('.searchfunction'),
	});
	$('.select2-with-search2').select2({

		searchInputPlaceholder: 'Search',
		width: '100%',
	});
 
});

$('#search-markets').focus(function() {
    $('div.select-markets-filters').css('display', 'flex');
    $(document).bind('focusin.select-markets-filters click.select-markets-filters',function(e) {
        if ($(e.target).closest('.select-markets-filters, #search-markets').length) return;
        $(document).unbind('.select-markets-filters');
        $('div.select-markets-filters').slideUp(300);
    });
});
$('div.select-markets-filters').hide();


$('.scrollable-container').perfectScrollbar();






// Webchat javascript

class InteractiveChatbox {
    constructor(a, b, c) {
        this.args = {
            button: a,
            chatbox: b
        }
        this.icons = c;
        this.state = false; 
    }

    display() {
        const {button, chatbox} = this.args;
        
        button.addEventListener('click', () => this.toggleState(chatbox))
    }

    toggleState(chatbox) {
        this.state = !this.state;
        this.showOrHideChatBox(chatbox, this.args.button);
    }

    showOrHideChatBox(chatbox, button) {
        if(this.state) {
            chatbox.classList.add('chatbox--active')
            this.toggleIcon(true, button);
        } else if (!this.state) {
            chatbox.classList.remove('chatbox--active')
            this.toggleIcon(false, button);
        }
    }

    toggleIcon(state, button) {
        const { isClicked, isNotClicked } = this.icons;
        let b = button.children[0].innerHTML;

        if(state) {
            button.children[0].innerHTML = isClicked; 
        } else if(!state) {
            button.children[0].innerHTML = isNotClicked;
        }
    }
}



const chatButton = document.querySelector('.chatbox__button');
const chatContent = document.querySelector('.chatbox__support');
const icons = {
    isClicked: '<img src="assets/img/chat-close.png" />',
    isNotClicked: '<img src="assets/img/chatbox-icon.png" />'
}
const chatbox = new InteractiveChatbox(chatButton, chatContent, icons);
chatbox.display();
chatbox.toggleIcon(false, chatButton);
 
 