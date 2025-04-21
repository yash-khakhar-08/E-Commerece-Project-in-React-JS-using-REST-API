import React from 'react'

class AddProduct extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            "product":{},
            "file":'',
            "message":'',
            "category":[]
        }
    }

    handleChange(e){
        
        this.setState({"product":{ ...this.state.product, [e.target.name]: e.target.value} });
          
    }

    handleSelectedCategory(e){
        this.setState({"selectCategory":e.target.value})
    }

    handleFileChange(e){
        this.setState({"file":e.target.files[0]});
    }

    async handleSubmit(e){

        e.preventDefault();

        const formData = new FormData();
        formData.append("product", JSON.stringify(this.state.product)); 
        formData.append("image", this.state.file); 
        formData.append("selectedCategory", this.state.selectCategory); 

        try {
            const response = await fetch("http://localhost:8080/admin/addProduct", {
                method: "POST",
                body: formData,
            });

            if(response.ok){
                this.setState({"message":'Product Added Successfully!!'})
            } else{
                this.setState({"message":'Something went wrong on server!!'})
            }

        } catch(error){
            this.setState({"message":'Something went wrong on server!!'})
        }

    }

    async componentDidMount(){
        
        try{

            const response = await fetch("http://localhost:8080/admin/getCategory")
    
            if(response.ok){
                const data = await response.json()
                this.setState({"category":data})
            } else{
                console.log("server error")
            }

        } catch(error){
            console.log(error)
        }

    }

    render() {
      return (
        <div className='container border p-2 w-50'>
          
          <form onSubmit={this.handleSubmit.bind(this)} encType="multipart/form-data">
            <h4 className='text-center'>Add Product</h4>
            <h5 className='text-center'>{this.state.message}</h5>
            <div className="form-group">
                <label>Select Category</label>
                <select className='form-control' name="category" onChange={this.handleSelectedCategory.bind(this)} required>
                    <option value="" disabled selected>--Select Category</option>
                {
                      this.state.category.length>0? this.state.category.map(
                        (value, index) => {
                          return(
                            <option value={JSON.stringify(value)} key={value.id}>
                            {value.catName} - {value.sectionName}
                            </option>
                          )
                        }
                      )
                       : <option>
                      No Categories
                    </option>
                    }
                </select>
            </div>
            <div className="form-group">
                <label>Product Name</label>
                <input type="text" className="form-control" placeholder="Product name" name="productName" onChange={this.handleChange.bind(this)} required/>
            </div>
            <div className="form-group">
                <label>Product Description</label>
                <textarea className='form-control' name="productDesc" onChange={this.handleChange.bind(this)} required></textarea>
            </div>
            <div className="form-group">
                <label>Product Price</label>
                <input type="number" className="form-control" name="productPrice" onChange={this.handleChange.bind(this)} required />
            </div>
            <div className="form-group">
                <label>Product Quantity</label>
                <input type="number" className="form-control" name="productQty" onChange={this.handleChange.bind(this)} required />
            </div>
            <div className="form-group">
                <label>Product Image</label>
                <input type="file" name="image" accept="image/*" onChange={this.handleFileChange.bind(this)} className="form-control" required />
            </div>
            <button type="submit" className="btn btn-primary">Add</button>
            </form>
          
        </div>
      )
    }

}

export default AddProduct