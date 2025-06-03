import instance from "../instance";

export const login = async() => {
      try {
         const res = await instance.get('login')  
         console.log("Res",res) 
      } catch (error) {
           throw error; 
      }
}