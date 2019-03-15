1. 定义路由
   1.1 routes/*: 路由, 路由可以想象成是组成应用的不同页面
   1.2 添加路由信息到路由表，编辑 router.js

2. UI Component
   随着应用的发展，你会需要在多个页面分享 UI 元素 (或在一个页面使用多次)，在 dva 里你可以把这部分抽成 component 。

3. 定义 Model
   完成 UI 后，现在开始处理数据和逻辑。
   dva 通过 model 的概念把一个领域的模型管理起来，包含同步更新 state 的 reducers，处理异步逻辑的 effects，订阅数据源的 subscriptions 。

4. 到这里，我们已经单独完成了 model 和 component，那么他们如何串联起来呢?
   dva 提供了 connect 方法。如果你熟悉 redux，这个 connect 就是 react-redux 的 connect 。
   
Dva 概念
1. 数据流向
数据的改变发生通常是通过用户交互行为或者浏览器行为（如路由跳转等）触发的，当此类行为会改变数据的时候可以通过
dispatch 发起一个 action，如果是同步行为会直接通过 Reducers 改变 State ，如果是异步行为（副作用）会先触
发 Effects 然后流向 Reducers 最终改变 State，所以在 dva 中，数据流向非常清晰简明，并且思路基本跟开源社区
保持一致（也是来自于开源社区）。

2. Models
   2.1 State
   State 表示 Model 的状态数据，通常表现为一个 javascript 对象（当然它可以是任何值）；操作的时候每次都要
   当作不可变数据（immutable data）来对待，保证每次都是全新对象，没有引用关系，这样才能保证 State 的独立性，便于测试和追踪变化。
   2.2 Action
   Action 是一个普通 javascript 对象，它是改变 State 的唯一途径。无论是从 UI 事件、网络回调，还是 WebSocket
    等数据源所获得的数据，最终都会通过 dispatch 函数调用一个 action，从而改变对应的数据。action 必须带有 type 属性指明具体的行为，
    其它字段可以自定义，如果要发起一个 action 需要使用 dispatch 函数；需要注意的是 dispatch 是在组件 connect Models以后，通过 props 传入的。
