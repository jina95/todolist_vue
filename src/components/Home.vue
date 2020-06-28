<template>
  <v-container>
    <v-flex text-xs-left>
      <span class="date">DATE:</span>
      <p class="date_value" v-bind="resetTime()"> {{ toDay }}</p>
    </v-flex>
    <v-layout row wrap class="contents_box">
      <v-flex xs12 text-xs-center class="header_box">
        <div><h1>CHECK LIST</h1></div>
      </v-flex>
      <v-flex pa-2>
        <ListAdd
        @listAdd='listAdd'
        @listEdit='listEdit'
        ></ListAdd>
        <v-flex class="list_box">
          <List
          :todolist='todoList'
          @statusControl='statusControl'
          @listDelete='listDelete'
          ></List>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import List from './List.vue'
import ListAdd from './ListAdd.vue'
export default {
  data() {
    return {
      todoList: [],
      toDay: '',
      nowTime: 0
    }
  },
  components:{List, ListAdd},
  computed:{
    countDone(){ // 완료된 할일 몇개인지 확인.
      let count = 0;
      for (let i = 0; i < this.todoList.length; i++) {
        if(this.todoList[i].status === 'done') count++
      }
      return count;
    }
  },
  methods: {
    listTime(){ // 리스트를 추가, 수정 했을때 시간을 나타내주는 함수.
      let hh = new Date().getHours().toString()
      let mm = new Date().getMinutes().toString()
      let ss = new Date().getSeconds().toString()

      return this.nowTime = ` ${hh < 10 ? `0${hh}` : hh}:${mm < 10 ? `0${mm}` : mm}:${ss < 10 ? `0${ss}` : ss} `
    },
    listAdd(memo, index) { // 리스트 추가 함수
      this.todoList.push({ memo: memo, status: "created", mode: "add", display: 'block', star: 'none', time: this.listTime(), index: index})
      // status 는 부활 값 / mode 는 수정인지, 추가인지 확인 / display는 수정버튼 눌렀을때 리스트들 버튼이 사라지는지 생기는지 확인 
    },
    statusControl(index, status){  // 완료여부 확인 함수
      this.todoList[index].status = status
    },
    listDelete(index){ // 제거 함수
      this.todoList.splice(index, 1)
    },
    listEdit(memo, index, mode, display){ // 수정 함수
      this.todoList[index].memo = memo
      this.todoList[index].mode = mode
      // edit 이 되었을때 mode 값을 edit > add 로 바꿔줘야 하기 때문에 넘겨주는 mode 값.
      this.todoList[index].time = this.listTime()
      
      for (let i = 0; i < this.todoList.length; i++) {
      this.todoList[i].display = display
      }

    },
    resetTime(){ //실시간으로 현재시간을 업데이트 해주는 함수.
      setInterval(()=>{
        let date = new Date();
        let month = date.getMonth();
        let todayDate = date.getDate();
        let day = date.getDay();
        const week = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

        let toDate = `${month+1}월${todayDate}일  ${week[day]} `
        this.toDay = toDate
      }, 1000); 
    }
    
  }
}
</script>

<style>
</style>