<style scoped>

    td:nth-child(1) {
        width: 5%;
        min-width: 50px;
    }

    td:nth-child(2) {
        width: 45%;
        position: relative
    }

    td:nth-child(3) {
        width: 30%;
    }

    td:nth-child(4) {
        width: 15%;
    }

    input, select {
        border: 0;
        height: 100%;
        width: 100%;
        line-height: 100%;
        text-indent: 5px;
        outline: none;
        border-bottom: 2px solid transparent;
        background: transparent;
        transition: all .4s;
    }

    input:focus {
        border-bottom: 2px solid #00BCD4;
    }

    .btn-delete {
        background: #ffbfbf;
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        border-radius: 0;
        border: 0;
        outline: none;
        padding: 0 10px;
        transition: all .4s;
        opacity: 0;
        height: 100%;
    }

    tr:hover .btn-delete {
        opacity: 1;
    }

    .amount {
        font-weight: bold;
        text-align: right;
        padding-right: 10px;
        box-sizing: border-box;
    }
</style>

<template>
    <tr>
        <td>
            <input type="text" class="amount" v-model="item.amount" @change="moneyChanged">
        </td>
        <td>
            <input type="text" v-model="item.description" @change="changed">
            <button class="btn btn-delete" @click="deleteItem">X</button>
        </td>
        <td>
            <label>
                <input class="dropdown-input" :value="item.category" @change="changed" @awesomplete-selectcomplete="changed">
                <button class="dropdown-btn" type="button">+</button>
            </label>
        </td>
        <td>
            <input type="text" :value="date" @change="dateChange" class="date">
        </td>
    </tr>
</template>

<script>
	import Pikaday from '@/libs/pikaday';
	import dateService from '@/services/date-service';
	import authService from '@/services/auth-service';
	import currencyService from '@/services/currency-service';
	import Awesomplete from '@/libs/awesomplete';

	export default {
		name: 'app-datasheet-item',
		props: ['item', 'service'],

		mounted: function () {
			new Pikaday({field: this.$el.querySelector('input.date')});

			const comboplete = new Awesomplete(this.$el.querySelector('.dropdown-input'), {
				minChars: 0,
				list: this.service.getCategories(),
			});


			this.$el.querySelector('.dropdown-btn').addEventListener("click", (e) => {
				comboplete.list = this.service.getCategories();
				if (comboplete.ul.childNodes.length === 0) {
					comboplete.minChars = 0;
					comboplete.evaluate(e, true);
				} else if (comboplete.ul.hasAttribute('hidden')) {
					comboplete.evaluate(e, true);
					comboplete.open();
				} else {
					comboplete.close();
				}
			});
		},

		computed: {
			date: function () {
				return dateService.fromTimestamp(this.item.date, 'DD.MM.YYYY');
			}
		},

		methods: {
			dateChange: function (event) {
				const val = event.target.value;
				this.item.date = dateService.toTimestamp(val, 'DD.MM.YYYY');
				this.changed();
			},

      moneyChanged: function () {
			  let amount = parseFloat(this.item.amount)
        if (this.item.amount.indexOf('$') != -1) {
			    this.item.amount = amount.toFixed(1)
        } else {
			    this.item.amount =  (amount / currencyService.getCurrencyRate()).toFixed(1)
        }

			  this.changed()
      },

			changed: function () {
				this.item.category = this.$el.querySelector('.dropdown-input').value;
				this.service.dbPushItem(this.item);
			},

			deleteItem: function () {
				this.service.delete(this.item.id);
			}
		},

		data () {
			return {}
		}
	}
</script>


