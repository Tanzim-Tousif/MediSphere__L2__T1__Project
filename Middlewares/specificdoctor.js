const query = require('../Database/DB-specified-doctors');
const specificdoctorhandler = async(req,res,next) => {
    console.log("speciality is ")
    console.log(req.params.id);
    
   console.log(req.query)
   //{ specialty: 'Female', mcq: 'feeslow', mxfee: '747',rating:'4'}
        if(req.query.specialty){
            if(req.query.mcq){
                   if(req.query.mxfee){
                         if(req.query.rating){
                             /// has specialty mcq mxfee rating
                             console.log("specialty mcq mxfee rating")
                             const result = await query.searchbyspecialitymcqmxfeerating(req.params.id,req.query.specialty,req.query.mcq,req.query.mxfee,req.query.rating);
                             res.render('index',{
                                 name:result.rows,
                                 user:req.session.user,
                                 speciality:req.params.id
                                })
                         }
                         else{
                           /// has specialty mcq mxfee 
                           console.log("specialty mcq mxfee ")
                           const result = await query.searchbyspecialitymcqmxfee(req.params.id,req.query.specialty,req.query.mcq,req.query.mxfee,req.query.rating);
                           res.render('index',{
                               name:result.rows,
                               user:req.session.user,
                               speciality:req.params.id

                              })

                         }
                   }
                   else{
                    if(req.query.rating){
                        /// has specialty mcq  rating
                        // console.log("specialty mcq  rating")
                        // const result = await query.getdoctorsbyspecialiy(req.params.id);
                        // res.render('index',{
                        //     name:result.rows,
                        //     user:req.session.user,
                        //     speciality:req.params.id
                        //    })

                    }
                    else{
                      /// has specialty mcq  
                      console.log("specialty mcq  ")
                    //   const result = await query.getdoctorsbyspecialiy(req.params.id);
                    //   res.render('index',{
                    //       name:result.rows,
                    //       user:req.session.user,
                    //       speciality:req.params.id
                    //      })


                    }
                   }
            }
            else{
                if(req.query.mxfee){
                    if(req.query.rating){
                        /// has specialty  mxfee rating
                        console.log("specialty  mxfee rating")
                        const result = await query.searchbyspecialitymxfee(req.params.id,req.query.specialty,req.query.mxfee,req.query.rating);
                        res.render('index',{
                            name:result.rows,
                            user:req.session.user,
                            speciality:req.params.id

                           })

                    }
                    else{
                      /// has specialty  mxfee 
                      console.log("specialty  mxfee ")
                      const result = await query.searchbyspecialitymxfee(req.params.id,req.query.specialty,req.query.mxfee);
                      res.render('index',{
                          name:result.rows,
                          user:req.session.user,
                          speciality:req.params.id

                         })


                    }
              }
              else{
               if(req.query.rating){
                   /// has specialty   rating
               }
               else{
                 /// has specialty 
               }
              }

            }
        }
        else{
            if(req.query.mcq){
                if(req.query.mxfee){
                      if(req.query.rating){
                          /// has  mcq mxfee rating
                          console.log(" mcq mxfee rating")
                          const result = await query.searchbymcqmxfeerating(req.params.id,req.query.mcq,req.query.mxfee,req.query.rating);
                          res.render('index',{
                              name:result.rows,
                              user:req.session.user,
                              speciality:req.params.id

                             })

                      }
                      else{
                        /// has  mcq mxfee 
                        console.log(" mcq mxfee ")
                        const result = await query.searchbymcqmxfee(req.params.id,req.query.mcq,req.query.mxfee);
                        res.render('index',{
                            name:result.rows,
                            user:req.session.user,
                            speciality:req.params.id

                        })


                      }
                }
                else{
                 if(req.query.rating){
                     /// has  mcq  rating
                     console.log(" mcq  rating")
                     const result = await query.searchbymcqrating(req.params.id,req.query.mcq,req.query.rating);
                     res.render('index',{
                         name:result.rows,
                         user:req.session.user,
                         speciality:req.params.id

                        })

                 }
                 else{
                   /// has  mcq  
                 }
                }
         }
         else{
             if(req.query.mxfee){
                 if(req.query.rating){
                     /// has   mxfee rating
                     console.log("  mxfee rating")
                     const result = await query.searchbymxfeerating(req.params.id,req.query.mxfee,req.query.rating);
                     res.render('index',{
                         name:result.rows,
                         user:req.session.user,
                         speciality:req.params.id

                        })

                 }
                 else{
                   /// has   mxfee 
                   console.log("  mxfee ")
                   const result = await query.searchbymxfee(req.params.id,req.query.mxfee);
                   res.render('index',{
                       name:result.rows,
                       user:req.session.user,
                       speciality:req.params.id

                      })
                      //console.log("adfsdff")
                 }
           }
           else{
            if(req.query.rating){
                /// has    rating
            }
            else{
              /// has nothing 
              console.log("nothing")
  
              const result = await query.getdoctorsbyspecialiy(req.params.id);
              res.render('index',{
                  name:result.rows,
                  user:req.session.user,
                  speciality:req.params.id
                 })
            }
           }

         }
        }
   

}
module.exports = specificdoctorhandler;

