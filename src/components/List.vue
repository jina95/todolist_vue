<template>
  <div>
    <div
    :class="{'done' : list.status === 'done', 'edit' : list.mode === 'edit'}"
    v-for="(list,index) in todolist"
    :key="index"
    class="pa-3 ma-2">
      <p class="pa-3">{{ list.memo }}</p>
      <div class="btn_box">
        <v-btn
        v-if="list.star === 'none'"
        @click="starOn(index)"
        :disabled="list.display === 'none' || list.status === 'done' || list.mode === 'edit'"
        fab flat small color="red">
        <i class="far fa-star"></i>
        </v-btn>
        <v-btn
          v-else-if="list.star === 'block'"
          @click="starOff(index)"
          :disabled="list.display === 'none' || list.status === 'done' || list.mode === 'edit'"
          fab flat small color="red">
          <i class="fas fa-star"></i>
        </v-btn>
        <!-- star 아이콘 -->
        <!-- 수정 버튼을 눌렀을때도 스타가 눌리면 안되기때문에 disabled 에 list.mode === edit 을 추가했는데, 아예 별 모양을 없애고 싶다면, if 문에 || list.mode === 'edit' 를 넣으면 해결 할 수있다. >> 현재는 별 모양은 남겨놓고 눌리지만 않게 하였다. -->
        <!-- 완료 버튼을 눌렀을때 스타가 눌리면 안되기때문에 disabled 조건 중 status === done 를 추가했다. -->
        <v-btn 
          v-if="list.status === 'created' &&  list.mode === 'add'"
          @click="$emit('statusControl', index, 'done')"
          :disabled="list.display === 'none'"
          fab flat small color="green">
            <i class="fas fa-check"></i>
        </v-btn> 
        <!--완료-->
        <v-btn 
          v-else-if="list.status === 'done' && list.mode === 'add'"
          @click="$emit('statusControl', index, 'created')"
          :disabled="list.display === 'none'"
          fab flat small color="amber">
            <i class="fas fa-redo-alt"></i>
        </v-btn> 
        <!--부활-->
        <v-btn 
          v-if="list.mode === 'add'"
          @click="$emit('listDelete', index)"
          :disabled="list.display === 'none'"
          fab flat small color="red accent-1">
            <i class="fas fa-trash-alt"></i>
        </v-btn> 
        <!--삭제-->
        <v-btn 
          v-if="list.status === 'created' &&  list.mode === 'add'"
          @click="listEdit(list.memo, index, 'edit', 'none')"
          :disabled="list.display === 'none'"
          fab flat small color="amber">
            <i class="fas fa-edit"></i>
        </v-btn> 
        <!--수정-->
      </div>         
      <span
        v-if="list.mode === 'add'">
        {{ list.time }}
      </span>
    </div> 
  </div>
  <!-- v-if="list.mode === 'add'" >> 이부분은 수정버튼을 눌렀을때는 수정버튼이 사라지게 하기 위함. -->
  <!-- 완료 됬을때 수정이 가능하면 안되기 때문에 status 는 create 이어야 한다. -->
  <!-- :class="{'none' : 나머지 === '나머지'}" -->
</template>

<script>
import { eventBus } from '../main'
export default {
  props:['todolist'],
  methods:{
    listEdit(memo, index, mode, display){ // 수정함수.
      eventBus.listEdit(memo, index, mode, display) // 이벤트버스로 보내는 항목들.
      this.todolist[index].mode = mode
      // 투두리스트의 모드는 = edit 이 된다.
      for (let i=0; i < this.todolist.length; i++) {
          if(this.todolist[i].mode === 'add') {
            this.todolist[i].display = display
            // mode 가 edit 이 아닌 리스트들의 버튼을 none 시켜줘야 하기때문에
            // 나머지 배열의 display 를 'none' 시킨다.
          }
      }
    },
    starOn(index){
      // star 가 채워지지 않은 상태라면 
      this.todolist[index].star = 'block'
      let starOn = this.todolist[index] // 눌려진 star 를 starOn 에 담고
      this.todolist.splice(index, 1) // 실제 배열에서의 눌린 값(starOn 에 담겨진 값)을 지우고
      this.todolist.unshift(starOn) // 담아 둔 starOn 을 배열 맨 앞에 넣는다.
    },
    starOff(index){
      // 눌려진 star 의 불을 끌 때면
      this.todolist[index].star = 'none'
      let starNum = this.todolist[index].index
      let starOff = this.todolist[index] // 누른 star 를 starOff 에 담고
      let nowStarOn = 0 // 지금 켜져있는 별 갯수 확인
      for (let i=0; i < this.todolist.length; i++) {
        if (this.todolist[i].star === 'block') nowStarOn++ // 현재 배열에서 불이 켜져있는 것이 몇개인지 확인한 뒤
      }
      if(nowStarOn === 0 ){ // 켜져있는 별이 없다면,
        this.todolist.splice(index, 1) // 현재 눌린 배열을 지우고
        this.todolist.splice(starNum, 0, starOff) // 불이 켜져 있는것 다음에 아무것도 지우지 말고(0) 아까 담은 starOff 를 그 뒤에 넣는다.
      } else if (starNum === 0){
        this.todolist.splice(index, 1)
        this.todolist.splice(nowStarOn, 0, starOff)
      } else {
        let near = 0;
        let abs = 0; 
        let min = 100; //해당 범위에서 가장 큰 값
        let nearNum = 0;
        this.todolist.splice(index, 1)
        for (let i = 0; i < this.todolist.length; i++)
        {
          if(this.todolist[i].star === 'none') {
            abs = ((this.todolist[i].index - starNum) < 0) ? -(this.todolist[i].index - starNum) :
            (this.todolist[i].index - starNum);
            if (abs < min)
            {
              min = abs; //MIN
              near = this.todolist[i].index
              nearNum = i + 1 //near : 가까운값
            }
          } 
        }
        this.todolist.splice(nearNum, 0, starOff)
      } 
    }
  }
}
</script>

<style>


</style>