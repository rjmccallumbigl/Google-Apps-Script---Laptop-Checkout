# Google-Apps-Script---Laptop-Checkout
Google Sheet laptop checkout system using GAS and HTML. Create a new Google Sheet and follow these instructions to implement and/or modify accordingly:

# Steps
1. Create a new Google Sheet: https://sheets.new
2. Create a sheet called `Department`. Put `Dept Code` in `A1` and the identifier for the dept in A2:A. The rest of the columns are simply for identification, information, etc. 

![image](https://user-images.githubusercontent.com/15747450/164994179-46e64c7d-9e8b-4276-94d9-5b1e6d261f51.png)

3. Fill out your Laptop information on a new sheet called `Laptops`. Place the header columns and additional info like so:

Laptop|	Serial Number	|Checked Out?|	Department	|Last Name|	First Name|	Phone Number|	Date checked out|	Estimated Return Date|	Notes	|Additional check outs
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
| Name  | ID  | Checkbox  | 
| Name  | ID  | Checkbox  | 
| ...  | ...  | ...  | 

4. Create a `History` sheet with the following headers:

Date|	Did the user report any issues with the laptop?	|Did you find any issues with the laptop?|	Laptop	|Last Name|	First Name|	Phone Number|	Date checked out|	Estimated Return Date|	Notes	|Additional check outs
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
| ...  |

5. Click `Extensions` -> `Apps Script` to get to the GAS code editor. Delete all the text in the script editor and paste the script in this repo at [Code.gs](./Code.gs). Save.
6. Reload the spreadsheet. Run the function `createSpreadsheetOpenTrigger()`. It will have the text `Click Here (you only need to run this the first time)` in the Google Sheet menu. Running this function creates a trigger to launch our script whenever the a in `Laptops` is checked or unchecked.

![image](https://user-images.githubusercontent.com/15747450/164994662-d434c5ab-9709-489b-9c7b-813fb0134af0.png)

7. Now whenever you click the checkbox in `Laptops!C2:C`, the HTML box will appear to allow data entry:

![image](https://user-images.githubusercontent.com/15747450/164994681-b35374c1-ee27-4b20-adde-bd593988e562.png)

Results in the `Laptop` sheet:

![image](https://user-images.githubusercontent.com/15747450/164994650-0ebca21c-ffcc-4bd9-ac4f-5acdba490e00.png)

Results from the `History` sheet on Check In (e.g. unchecking the box in `Laptops`:

![image](https://user-images.githubusercontent.com/15747450/164994753-f916014c-a1f9-4475-aba7-e86f6bfd8c7f.png)
