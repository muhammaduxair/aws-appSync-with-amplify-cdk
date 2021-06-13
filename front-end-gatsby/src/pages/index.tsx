import React, { useEffect, useState } from "react"
import { addTodo } from "../graphql/mutations"
import { getTodos } from "../graphql/queries"
import { API, graphqlOperation } from "aws-amplify"
import { onAddTodo } from "../graphql/subscriptions"

interface DataType {
  id: string
  title: string
}

const IndexPage = () => {
  const [todo, setTodo] = useState<DataType>({ id: "", title: "" })
  const subscription = API.graphql(graphqlOperation(onAddTodo)) as any

  // ===== function =====================
  const fetchTodos = async () => {
    try {
      const res = await API.graphql({
        query: getTodos,
      })
      console.log(res)
    } catch (e) {
      console.log(e)
    }
  }

  const addingTodo = async () => {
    try {
      if (todo.id && todo.title) {
        const data = await API.graphql({
          query: addTodo,
          variables: { todo },
        })
        console.log(data)
        setTodo({ id: "", title: "" })
      } else {
        alert(`id:"${todo.id}" title:"${todo.title}"`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  function handleSubscription() {
    subscription.subscribe({
      next: status => {
        console.log("New SUBSCRIPTION ==> ", status.value.data)
        fetchTodos()
      },
    })
  }

  useEffect(() => {
    fetchTodos() //will fetch data for the first time
    handleSubscription() // will make a subscription connection for the first time
  }, [])
  // ===== function =====================

  return (
    <div>
      <h1>Hello From Amplify</h1>
      <button onClick={fetchTodos}>Fetch Todos</button>
      <br />
      <br />
      <div>
        <input
          placeholder="Enter ID"
          onChange={e => setTodo({ ...todo, id: e.target.value })}
          value={todo.id}
        />
        <input
          placeholder="Enter Title"
          onChange={e => setTodo({ ...todo, title: e.target.value })}
          value={todo.title}
        />
      </div>
      <button onClick={addingTodo}>Add Todos</button>
    </div>
  )
}

export default IndexPage
