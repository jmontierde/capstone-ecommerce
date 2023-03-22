import React from 'react'

const Home = () => {
  return (
    <div className='container px-12 py-6 mx-auto '>
        <section>
            <h1 className='text-4xl mb-6'>Products</h1>
            <div className='grid grid-cols-3 gap-6 text-center'>
                <div className='bg-[#ffffff]'>
                    <img className='w-2/4  mx-auto ' src="/images/cpu1.png" alt="" />
                    <a href='https://www.google.com/'>Nvision N190HD 19 Inch LED Monitor</a>
                    <div className='flex my-3 mx-32'>
                        <img src="/images/empty-star.png" className='w-6 mx-auto' alt="empty star" />
                        <img src="/images/empty-star.png" className='w-6 mx-auto' alt="empty star" />
                        <img src="/images/empty-star.png" className='w-6 mx-auto' alt="empty star" />
                        <img src="/images/empty-star.png" className='w-6 mx-auto' alt="empty star" />
                        <img src="/images/empty-star.png" className='w-6 mx-auto' alt="empty star" />
                    </div>
                    <h2 className='text-xl text-left px-24 mb-6'>₱2000</h2>
                </div>
                
            </div>

            
            
        </section>
    </div>
  )
}

export default Home