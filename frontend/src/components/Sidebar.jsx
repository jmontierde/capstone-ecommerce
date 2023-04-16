import React from 'react'

const Sidebar = () => {
  return (
    <aside className='flex flex-col container mr-auto h-full  '>
      <div>
        <select name="relx" id="relx">
              <option value="relx-pod-pro">Relx Pod Pro</option>
              <option value="relx-essentials">Relx Essentials</option>
              <option value="relx-infinity">Relx Infinity</option>
              <option value="relx-infinity-plus">Relx Infinity Plus</option>
        </select>
        <select name="mods" id="mods">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
        </select>
        <select name="cars" id="cars">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
        </select>
      </div>
   
    </aside>
  )
}

export default Sidebar