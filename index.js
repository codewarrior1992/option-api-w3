Vue.createApp({
  data(){
    return{
      todo:'',
      todoList:[],
      catchId:'',
      edit:false,
      filter:'All'
    }
  },
  methods:{
    getTodo(id){
      // 這邊為什麼不用 include() ? 因為我打算全程用 id 來篩選
      // 若我這函式傳進的是 item 本身, 就能使用 include 查找
      const index = this.todoList.findIndex((item)=>{
        return item.id == id
      })
      return this.todoList[index]
    },
    addTodo(){
      if(!this.edit){
        this.todoList.unshift({
          id : Math.floor(Date.now()),
          value : this.todo,
          completed: false
        })
        this.todo = '';
      }
      else{
        const todo = this.getTodo(this.catchId);
        todo.value = this.todo;
        this.edit = false;
        this.todo = '';
        this.catchId = '';
      }
    },
    remove(id){
      const item = this.getTodo(id)
      this.todoList = this.todoList.filter((todo)=>{
        return todo.id !== item.id
      })
    },
    editTodo(id){
      const item = this.getTodo(id)
      this.todo = item.value;
      this.$refs.inputFoucs.focus();
      this.edit = true;
      this.catchId = item.id;
    },
    cancelEdit(){
      this.edit = false;
      this.todo = '';
      this.catchId = '';
    },
    handleList(keyword){
      if(keyword == 'completed'){
        this.todoList.forEach((item)=>{
            item.completed = true
        })
      } else {
        if(confirm('確定刪除所有 todo ?')) this.todoList = [] 
      }
    },
    completedTodo(id,completed){
      const todo = this.getTodo(id);
      todo.completed = !todo.completed;
    }
  },
  watch:{
    todoList:{
      handler:function(newItem){
        localStorage.setItem('list',JSON.stringify(newItem))
      },
      deep:true
    },
  },
  computed:{
    filterTodoList(){
      switch(this.filter){
        case('completed'):
          return this.todoList.filter((item) => item.completed)
        break;
        case('todo'):
          return this.todoList.filter((item)=> !item.completed)
        break;
        default:
          return this.todoList
        break;  
      }
    }
  },
  mounted(){
    this.todoList = JSON.parse(localStorage.getItem('list')) || []
  }
}).mount('#app')