# Grammar

## <a name="type-arguments-annotations"></a> Generic type argument annotations

*TypeArgument*:  
&emsp;~~*Type*~~  
&emsp;*TypeVariance*<sub>opt</sub>&emsp;*Type*  
*TypeVariance*:  
&emsp;`in`  
&emsp;`out`  
&emsp;`in out`  
&emsp;`out in`

### Array Type Literal special case

*ArrayType:*  
&emsp;~~*PrimaryType*&emsp;*[no LineTerminator here]*&emsp;`[`&emsp;`]`~~  
&emsp;*TypeVariance*<sub>opt</sub>&emsp;*PrimaryType*&emsp;*[no LineTerminator here]*&emsp;`[`&emsp;`]`

## <a name="type-parameters-annotations"></a> Generic type parameter annotations
_(this part of the proposal is optional)_

_TypeParameter_:  
&emsp;~~*BindingIdentifier&emsp;Constraint*<sub>opt</sub>~~  
&emsp;*TypeVariance*<sub>opt</sub>&emsp;*BindingIdentifier Constraint*<sub>opt</sub>