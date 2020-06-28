<template>
    <div class="list_add">
        <textarea
          v-model="memo"
          rows="5"
          placeholder="투두리스트를 입력해 주세요."
          @keypress.enter="enterKey"
        ></textarea>
        <v-btn
        v-if="mode === 'add'"
        @click='listAdd'
        >등록하기</v-btn>
        <v-btn
        v-else
        @click='listEdit'
        >수정하기</v-btn>
    </div>
</template>

<script>
import { eventBus } from '../main'
export default {
    data(){
        return {
            memo: null,
            mode: 'add',
            display: null,
            newIndex: 0
        }
    },
    created(){
        eventBus.$on('listEdit', (memo, index, mode, display) => {
            // 리스트에서 edit 버튼을 누른다면, 
            this.memo = memo
            this.index = index //this.index > data의 index가 없지만, this.index 를 줌으로써 index 칸이 생김.
            this.mode = mode
            this.display = display
        })
    },
    methods:{
        enterKey(event){
            // 00 을 입력했을때 엔터가 안먹는다.
            event.preventDefault() //엔터라는 동작 자체를 중단시키는것이라서! (preventDefault()가 없다면 memo 가 null 이 되도 계속해서 값을 가지고 있다.)
            if(this.mode === 'add') { 

                console.log(typeof this.memo === 'string' ? 'string' : 'nono');
                console.log(`${this.memo} this.memo`);

                // this.memo == !Object > 일때 0 은 false 이기 때문에 앞에 ! not 때문에 true 가 되고 그렇기 때문에 alert 이 뜬다.
                //  === !과 !== 의 차이는 무엇일까?  
                // this.memo === !Object  >>> 스페이스바를 눌러 한칸을 띄어도 리스트가 입력된다. 

                if(typeof this.memo === 'string' && this.memo.trim() === '') { // memo의 값이 공백이라면 alert 창을 띄워라.
                    alert('할 일을 등록해 주세요.') 
                    this.memo = null  // enter 로 밑으로 내려가 있는 커서를 다시 올려준다.  
                         
                } else {
                    this.listAdd() // 글자나 숫자 다른게 memo 에 입력되어있다면 listAdd를 실행시킨다.
                }
            } else { // mode === 'edit' 일때는 
                this.listEdit()
            }
            
        },
        listAdd(){ // 추가버튼을 눌렀을때
        console.log(this);
        
            if(this.memo === null) alert('할 일을 등록해 주세요.')
            else {
                
                this.$emit('listAdd', this.memo, this.newIndex)
                this.newIndex ++
                console.log(this.newIndex);
                
                this.memo = null
                
            }
        },
        listEdit(){ // 수정버튼을 눌렀을때
        console.log(this);
        
            if(this.memo === null) alert('할 일을 등록해 주세요.')
            else {
                this.mode = 'add'
                this.display = 'block' // 수정이 완료 되었기 때문에 버튼을 block 시키기 위해 값을 보낸다.
                this.$emit('listEdit', this.memo, this.index, this.mode, this.display)
                this.memo = null; // 완료 된 뒤에 메모 값을 다시 초기화 시켜야 한다.

                //mode를 같이 넘긴다.
                // 단 수정 완료 버튼이기때문에 mode 를 add 로 먼저 바꿔 준 뒤, 에밋으로 값을 올린다. 그 이후에 메모값을 null 로 바꿔줘야 칸의 값이 초기화가 된다.
            }
        }
    }
}
</script>

<style>
</style>