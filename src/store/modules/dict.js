export default {
    namespaced: true,
    state: {
        dict: undefined,
    },
    getters: {
        dict: state => {
            if (!state.dict) {
                try {
                    const dict = localStorage.getItem(process.env.VUE_APP_DICT_KEY)
                    state.dict = JSON.parse(dict)
                } catch (e) {
                    console.error(e)
                }
            }
            return state.dict
        },
        dictByCateCode: (state) => (cateCode) => {
            if (!state.dict) {
                try {
                    const dict = localStorage.getItem(process.env.VUE_APP_DICT_KEY)
                    state.dict = JSON.parse(dict)
                } catch (e) {
                    console.error(e)
                }
            }
            console.log(cateCode)
            return state.dict.filter(item => item.cate_code == cateCode)
                .map(item=>{return {id:item.id,name:item.name,code:item.code}})
        },
    },
    mutations: {
        setDict(state, dict) {
            state.dict = dict
            localStorage.setItem(process.env.VUE_APP_DICT_KEY, JSON.stringify(dict))
        }
    },
    actions: {
    },
}
